import joi from "joi";
import { generalFields } from "../../meddlewear/validation.js";
export const createUser = joi
  .object({
    name: joi.string().required().min(3).max(20),
    password: generalFields.password,
    cPassword: generalFields.cPassword,
    DOB: joi.date(),
    roles: joi.array().items(generalFields.id).required(),
    authorization: generalFields.headers,
  })
  .required();
export const updateUser = joi
  .object({
    name: joi.string().min(3).max(20),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      ),
    cPassword: joi.string().valid(joi.ref("password")),
    DOB: joi.date(),
    roles: joi.array().items(generalFields.id),
    authorization: generalFields.headers,
  })
  .required();
export const deleteUser = joi
  .object({
    userId:generalFields.id,
    authorization: generalFields.headers,
  })
  .required();
export const headers = joi
  .object({
    authorization: generalFields.headers,
  })
  .required();
