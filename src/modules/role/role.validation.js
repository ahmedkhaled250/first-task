import joi from "joi";
import { generalFields } from "../../meddlewear/validation.js";
export const addRole = joi
  .object({
    authorization: generalFields.headers,
    name: joi.string().required().min(2).max(20),
  })
  .required();
export const updateRole = joi
  .object({
    authorization: generalFields.headers,
    id: generalFields.id,
    name: joi.string().min(2).max(20),
  })
  .required();
export const deleteRole = joi
  .object({
    authorization: generalFields.headers,
    id: generalFields.id,
  })
  .required();
export const roles = joi
  .object({
    authorization: generalFields.headers,
    page: joi.string(),
    size: joi.string(),
  })
  .required();
