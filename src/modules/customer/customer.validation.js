import joi from "joi";
import { generalFields } from "../../meddlewear/validation.js";
export const profilePic = joi
  .object({
    image: generalFields.file,
    autrhorization: generalFields.headers,
  })
  .required();
export const headers = joi
  .object({
    autrhorization: generalFields.headers,
  })
  .required();
export const updatePassword = joi
  .object({
    autrhorization: generalFields.headers,
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
  })
  .required();
export const sendCode = joi
  .object({
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter realy email",
    }),
  })
  .required();
export const forgetPassword = joi
  .object({
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter realy email",
    }),
    code: joi.number().required(),
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
  })
  .required();
