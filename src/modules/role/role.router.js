import { Router } from "express";
import * as roleController from "./controller/role.js"
import * as validators from "./role.validation.js"
import roleEndPoint from "./role.endpoint.js"
import { auth } from "../../meddlewear/auth.js";
import validation from "../../meddlewear/validation.js";
const router = Router()
router.post("/", validation(validators.addRole),auth({accessRole:roleEndPoint.role}),roleController.addRole)
router.put("/:id", validation(validators.updateRole),auth({accessRole:roleEndPoint.role}),roleController.updateRole)
router.delete("/:id", validation(validators.deleteRole),auth({accessRole:roleEndPoint.role}),roleController.deleteRole)
router.get("/", validation(validators.roles),auth({accessRole:roleEndPoint.role}),roleController.roles)
export default router