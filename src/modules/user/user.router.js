import { Router } from "express";
import * as userController from "./controller/user.js"
import * as validators from "./user.validation.js"
import endpoint from "./user.endpoint.js"
import { auth } from "../../meddlewear/auth.js";
import validation from "../../meddlewear/validation.js";
const router = Router()
router.post("/", validation(validators.createUser),auth({accessRole:endpoint.superAdmin}),userController.createUser)
router.put("/:userId", validation(validators.updateUser),auth({accessRole:endpoint.superAdmin}),userController.updateUser)
router.delete("/:userId", validation(validators.deleteUser),auth({accessRole:endpoint.superAdmin}),userController.deleteUser)
router.get("/", validation(validators.headers),auth({accessRole:endpoint.superAdmin}),userController.users)
export default router