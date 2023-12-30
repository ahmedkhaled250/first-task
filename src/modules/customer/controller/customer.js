import { deleteOne, findOne } from "../../../../DB/DBMethods.js";
import customerModel from "../../../../DB/models/Customer.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { customAlphabet } from "nanoid";
import sendEmail from "../../../utils/sendEmail.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
export const profilePic = asyncHandler(async (req, res, next) => {
  const { customer } = req;
  if (customer.isDeleted) {
    return next(new Error("Your account has been deleted", { cause: 400 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APPNAME}/customer/${customer._id}/profilePic`,
    }
  );
  if (customer.image) {
    await cloudinary.uploader.destroy(customer.image.public_id);
  }
  customer.image = { secure_url, public_id };
  await customer.save();
  return res.status(200).json({ message: "Done", customer });
});
export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const { customer } = req;
  if (customer.isDeleted) {
    return next(new Error("Your account has been deleted", { cause: 400 }));
  }
  if (!customer.image) {
    return next(new Error("Already, you havn't profilePic", { cause: 400 }));
  }
  await cloudinary.uploader.destroy(customer.image.public_id);
  customer.image = null;
  await customer.save();
  return res.status(200).json({ message: "Done", customer });
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { customer } = req;
  const { password, oldPassword } = req.body;
  if (customer.isDeleted) {
    return next(new Error("Your account has been deleted", { cause: 400 }));
  }
  const match = compare({
    hashValue: customer.password,
    plaintext: oldPassword,
  });
  if (!match) {
    return next(new Error("Password miss match", { cause: 400 }));
  }
  const hashPassword = hash({ plaintext: password });
  customer.password = hashPassword;
  customer.changeTime = new Date();
  customer.isActive = false;
  await customer.save();
  const token = generateToken({
    payload: { id: customer._id },
    expiresIn: 60 * 60 * 24,
  });
  const refresh_token = generateToken({
    payload: { id: customer._id },
    expiresIn: 60 * 60 * 24 * 365,
  });
  return res.status(200).json({ message: "Done", token, refresh_token });
});
export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const customer = await findOne({
    model: customerModel,
    condition: { email },
  });
  if (!customer) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  const code = customAlphabet("123456789", 4);
  customer.code = code();
  await customer.save();
  const message = `
  <h1>Your code is : ${customer.code}<h1/>
  `;
  await sendEmail({ to: email, subject: "checkCode", message });
  return res.status(200).json({ message: "Done" });
});
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;
  const customer = await findOne({
    model: customerModel,
    condition: { email },
  });
  if (!customer) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (code != customer.code) {
    return next(new Error("This code is not valid", { cause: 400 }));
  }
  const hashPassword = hash({ plaintext: password });
  customer.code = null;
  customer.password = hashPassword;
  customer.changeTime = new Date();
  await customer.save();
  const token = generateToken({
    payload: { id: customer._id },
    expiresIn: 60 * 60 * 24,
  });
  const refresh_token = generateToken({
    payload: { id: customer._id },
    expiresIn: 60 * 60 * 24 * 365,
  });
  return res.status(200).json({ message: "Done", token, refresh_token });
});
export const softDelete = asyncHandler(async (req, res, next) => {
  const { customer } = req;
  if (customer.isDeleted) {
    customer.isDeleted = false;
  } else {
    customer.isDeleted = true;
  }
  await customer.save();
  return res.status(200).json({ message: "Done", customer });
});
export const deleteProfile = asyncHandler(async (req, res, next) => {
  const { customer } = req;
  const deleteCustomer = await deleteOne({
    model: customerModel,
    condition: { _id: customer._id },
  });
  if (!deleteCustomer.deletedCount) {
    return next(new Error("Fail to delete your profile"));
  }
  if (customer.image) {
    await cloudinary.uploader.destroy(customer.image.public_id);
  }
  return res.status(200).json({ message: "Done", deleteCustomer });
});
export const profile = asyncHandler(async (req, res, next) => {
  const { customer } = req;
  return res.status(200).json({ message: "Done", customer });
});
