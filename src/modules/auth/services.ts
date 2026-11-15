import {
  ForbiddenError,
  UnauthorizedError,
} from "../../common/error/auth-error";
import { ConflictError, NotFoundError } from "../../common/error/http-error";
import type { AuthUser } from "../../common/types/common";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt";
import { comparePassword, hashPassword } from "../../common/utils/password";
import { omitPassword } from "../../common/utils/request-evenlope-helper";
import { prisma } from "../../config/prisma";
import {
  USER_SELECT,
  type LoginResult,
  type RefreshTokenDTO,
  type SafeUser,
  type UserLogin,
  type UserRegister,
} from "./types";

export const authServices = {
  async register(data: UserRegister) {
    const { firstName, lastName, password, email, phone } = data;

    return await prisma.$transaction(async (tx) => {
      const isExist = await tx.user.findFirst({
        where: { OR: [{ email }, { phone }] },
      });

      if (isExist) {
        if (isExist.email === email) {
          throw new ConflictError("Email already exists.");
        }

        if (isExist.phone === phone) {
          throw new ConflictError("Phone already exists.");
        }
      }

      const passwordHash = await hashPassword(password);
      const refreshToken = signRefreshToken({ email });
      return await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          passwordHash,
          refreshToken,
        },
        select: USER_SELECT,
      });
    });
  },

  async login(data: UserLogin): Promise<LoginResult> {
    const { email, password } = data;
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const verifyPassword = await comparePassword(password, user.passwordHash);
      if (!verifyPassword) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const refreshToken = signRefreshToken({ email });
      const accessToken = signAccessToken({
        email,
        sub: String(user.id),
        role: "user",
      });

      await tx.user.update({ data: { refreshToken }, where: { email } });

      return {
        user: omitPassword(user),
        refreshToken,
        accessToken,
      };
    });
  },

  async refresh(payload: RefreshTokenDTO): Promise<LoginResult> {
    const { email } = verifyRefreshToken(payload.refreshToken);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("User no longer exist.");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account is disabled.");
    }
    const accessToken = signAccessToken({
      email: user.email,
      role: user.role,
      sub: user.id,
    });

    const refreshToken = signRefreshToken({ email: user.email });
    return { accessToken, refreshToken, user: omitPassword(user) };
  },

  async me(authUser: AuthUser): Promise<SafeUser> {
    const user = await prisma.user.findUnique({
      where: { id: authUser.sub },
      select: USER_SELECT,
    });
    if (!user) {
      throw new NotFoundError("user not Found.");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account is disabled.");
    }

    return user;
  },

  async changePassword(
    userId: string,
    data: { currentPass: string; newPass: string },
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }
    const verifyCurrentPass = await comparePassword(
      data.currentPass,
      user.passwordHash,
    );
    if (!verifyCurrentPass) {
      throw new UnauthorizedError("current password is incorrect");
    }

    const passwordHash = await hashPassword(data.newPass);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  },
};
