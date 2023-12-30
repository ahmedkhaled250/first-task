import {
  create,
  find,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
} from "../../../../DB/DBMethods.js";
import roleModel from "../../../../DB/models/Role.js";
import userModel from "../../../../DB/models/User.js";
import { hash } from "../../../utils/HashAndCompare.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createUser = asyncHandler(async (req, res, next) => {
  const { name, password, DOB, roles } = req.body;
  const role = [];
  for (const id of roles) {
    const checkRole = await findById({ model: roleModel, condition: id });
    if (!checkRole) {
      return next(new Error("In-valid roleId", { cause: 404 }));
    }
    role.push(id);
  }
  const hashPassword = hash({ plaintext: password });
  const user = await create({
    model: userModel,
    data: { name, password: hashPassword, DOB, role },
  });
  if (!user) {
    return next(new Error("Fail to craete user", { cause: 400 }));
  }
  return res.status(201).json({ message: "Done", user });
});
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, password, roles } = req.body;
  const { userId } = req.params;
  const user = await findById({ model: userModel, condition: userId });
  if (!user) {
    return next(new Error("In-valid userId", { cause: 404 }));
  }
  if (name) {
    if (name == user.name) {
      return next(
        new Error("You cannot update your name by the same name", {
          cause: 400,
        })
      );
    }
    req.body.name = name;
  }
  if (roles) {
    const role = [];
    for (const id of roles) {
      const checkRole = await findById({
        model: checkRoleModel,
        condition: id,
      });
      if (!checkRole) {
        return next(new Error("In-valid roleId", { cause: 404 }));
      }
      role.push(id);
    }
    req.body.role = role;
  }
  if (password) {
    const hashPassword = hash({ plaintext: password });
    req.body.password = hashPassword;
  }
  const updateUser = await findByIdAndUpdate({
    model: userModel,
    condition: userId,
    data: req.body,
  });
  if (!updateUser) {
    return next(new Error("Fail to update user", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done" });
});
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await findByIdAndDelete({ model: userModel, condition: userId });
  if (!user) {
    return next(new Error("In-valid userId", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done" });
});
export const users = asyncHandler(async (req, res, next) => {
  const users = await find({ model: userModel });
  if (!users.length) {
    return next(new Error("In-valid users", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done" ,users});
});
