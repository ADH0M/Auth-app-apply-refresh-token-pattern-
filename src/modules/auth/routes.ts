import { Router } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { authController } from "./controller";
import { validateHandler } from "../../common/middleware/validate";
import {
  ChangePasswordSchema,
  LoginSchema,
  RefreshTokenSchema,
  RegisterSchema,
} from "./dto";
import { auth } from "../../common/middleware/auth";

const router: Router = Router();

router.post(
  "/register",
  validateHandler({ body: RegisterSchema }),
  asyncHandler(authController.register),
);

router.post(
  "/login",
  validateHandler({ body: LoginSchema }),
  asyncHandler(authController.login),
);

router.post(
  "/refresh",
  auth,
  validateHandler({ body: RefreshTokenSchema }),
  asyncHandler(authController.refresh),
);

router.get("/me", auth, asyncHandler(authController.me));

router.post(
  "/me/change-password",
  auth,
  validateHandler({ body: ChangePasswordSchema }),
  asyncHandler(authController.changePassword),
);

export { router as authRouter };
