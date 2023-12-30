import {
  create,
  deleteOne,
  find,
  updateOne,
} from "../../../../DB/DBMethods.js";
import roleModel from "../../../../DB/models/Role.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import paginate from "../../../utils/paginate.js";

export const addRole = asyncHandler(async (req, res, next) => {
  const role = await create({
    model: roleModel,
    data: { roleName: req.body.name },
  });
  return res.status(200).json({ message: "Done", role });
});
export const updateRole = asyncHandler(async (req, res, next) => {
  const role = await updateOne({
    model: roleModel,
    condition: { _id: req.params.id },
    data: { roleName: req.body.name },
  });
  return res.status(200).json({ message: "Done", role });
});
export const deleteRole = asyncHandler(async (req, res, next) => {
  const role = await deleteOne({
    model: roleModel,
    condition: { _id: req.params.id },
  });
  return res.status(200).json({ message: "Done", role });
});
export const roles = async (req, res, next) => {
  const { limit, skip } = paginate({
    page: req.query.page,
    size: req.query.size,
  });
  const roles = await find({ model: roleModel, limit, skip });
  return res.status(200).json({ message: "Done", roles });
};
