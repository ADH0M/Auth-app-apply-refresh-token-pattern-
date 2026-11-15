import type { CookieOptions, NextFunction, Request, Response } from "express";
import { authServices } from "./services";
import type { RefreshTokenDTO, UserLogin, UserRegister } from "./types";
import { created, ok } from "../../common/utils/request-evenlope-helper";
import type { AuthUser } from "../../common/types/common";

const COOKIE_OPTIONS = {
  sameSite: "none",
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 1000,
} as CookieOptions;

export const authController = {
  async register(req: Request, res: Response, _next: NextFunction) {
    const data = req.body as UserRegister;
    const user = await authServices.register(data);
    res.status(201).json(created(user));
  },

  async login(req: Request, res: Response, _next: NextFunction) {
    const body = req.body as UserLogin;
    const { refreshToken, ...data } = await authServices.login(body);
    res.cookie("REFRESH_TOKEN", refreshToken, COOKIE_OPTIONS);
    res.status(200).json(ok(data));
  },

  async refresh(req: Request, res: Response, _next: NextFunction) {
    const { refreshToken } = req.body as RefreshTokenDTO;
    const payload = await authServices.refresh({ refreshToken });
    res.status(200).json(ok(payload));
  },

  async me(req: Request, res: Response, _next: NextFunction) {
    const authUser = req.user;
    const user = await authServices.me(authUser as AuthUser);
    res.status(200).json(ok(user));
  },
  async changePassword(req: Request, res: Response, _next: NextFunction) {
    const authUser = req.user;
    const { currentPass, newPass } = req.body;
    const user = await authServices.changePassword((authUser as AuthUser).sub, {
      currentPass,
      newPass,
    });
    res.status(201).json(ok(user));
  },
};
