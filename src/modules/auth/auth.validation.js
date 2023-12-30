import joi from "joi";
import { generalFields } from "../../meddlewear/validation.js";

export const signup = joi
  .object({
    firstName: joi.string().required().min(2).max(20).message({
      "any.required": "userName is required",
      "any.empty": "empty userName isn't acceptable",
    }),
    lastName: joi.string().required().min(2).max(20).message({
      "any.required": "userName is required",
      "any.empty": "empty userName isn't acceptable",
    }),
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter realy email",
    }),
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
    phone: joi.string().pattern(/^01[0125][0-9]{8}$/),
    gender: joi.string(),
    image: generalFields.file,
    address: joi.string(),
    DOB: joi.date(),
  })
  .required();
export const signin = joi
  .object({
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ["com", "net"] },
      })
      .messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
        "string.email": "please enter realy email",
      }),
      name:joi.string(),
    password: generalFields.password,
  })
  .required();
export const headers = joi
  .object({
    authorization:generalFields.headers
  })
  .required();
export const confirmEmail = joi
  .object({
    token: joi.string().required(),
  })
  .required();
