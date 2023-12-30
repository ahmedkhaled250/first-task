import { Router } from "express";
import * as authController from "./controller/auth.js";
import * as validators from "./auth.validation.js";
import validation from "../../meddlewear/validation.js";
import { auth } from "../../meddlewear/auth.js";
const router = Router();
router.post("/signup", validation(validators.signup), authController.signup);
router.get(
  "/confirmEmail/:token",
  validation(validators.confirmEmail),
  authController.confirmEmail
);
router.get(
  "/refreshEmail/:token",
  validation(validators.confirmEmail),
  authController.refreshEmail
);
router.post("/signin", validation(validators.signin), authController.signin);
router.patch(
  "/logout",
  validation(validators.headers),
  auth(),
  authController.logout
);
export default router;
