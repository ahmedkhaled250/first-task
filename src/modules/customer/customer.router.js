import { Router } from "express";
import * as customerController from "./controller/customer.js";
import * as validators from "./customer.validation.js";
import { auth } from "../../meddlewear/auth.js";
import { fileValidation, myMulter } from "../../utils/multer.js";
import validation from "../../meddlewear/validation.js";
const router = Router();
router.patch(
  "/profilePic",
  validation(validators.profilePic),
  auth(),
  myMulter(fileValidation.image).single("image"),
  customerController.profilePic
);
router.patch(
  "/deleteProfilePic",
  validation(validators.headers),
  auth(),
  customerController.deleteProfilePic
);
router.patch(
  "/softDelete",
  validation(validators.headers),
  auth(),
  customerController.softDelete
);
router.patch(
  "/updatePassword",
  validation(validators.updatePassword),
  auth(),
  customerController.updatePassword
);
router.patch(
  "/sendCode",
  validation(validators.sendCode),
  customerController.sendCode
);
router.patch(
  "/forgetPassword",
  validation(validators.forgetPassword),
  customerController.forgetPassword
);
router.delete(
  "/deleteProfile",
  validation(validators.headers),
  auth(),
  customerController.deleteProfile
);
router.get(
  "/profile",
  validation(validators.headers),
  auth(),
  customerController.profile
);
export default router;
