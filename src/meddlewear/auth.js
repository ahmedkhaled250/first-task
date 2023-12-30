import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import { findById } from "../../DB/DBMethods.js";
import userModel from "../../DB/models/User.js";
import customerModel from "../../DB/models/Customer.js";
import roleModel from "../../DB/models/Role.js";
export const roles = {
  SuberAdmen: "SuperAdmin",
};
export const auth = ({ accessRole = [] } = {}) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization.startsWith(process.env.BARERKEY)) {
      return next(new Error("In-valid BARERKEY", { cause: 400 }));
    }
    const token = authorization.split(process.env.BARERKEY)[1];
    const decoded = verifyToken({ token });
    if (!decoded?.id) {
      return next(new Error("In-valid token paylaod", { cause: 400 }));
    }
    let user = await findById({
      model: userModel,
      condition: decoded.id,
      select: "-password",
    });
    if (!user) {
      user = await findById({ model: customerModel, condition: decoded.id });
      if (!user) {
        return next(new Error("In-valid user has this Id", { cause: 400 }));
      }
    }
    const expireDate = parseInt(user.changeTime?.getTime() / 1000);
    if (expireDate > decoded.iat) {
      return next(new Error("Expire token", { cause: 400 }));
    }
    if (user.isBlocked) {
      return next(new Error("Your account has been blocked", { cause: 400 }));
    }
    if (!user.role) {
      if (!user.isActive) {
        return next(new Error("Go to login", { cause: 400 }));
      }
      req.customer = user;
    } else {
      for (const id of user.role) {
        const role = await findById({ model: roleModel, condition: id });
        if (accessRole.includes(role.roleName)) {
          req.user = user;
          break;
        }
      }
    }
    if (!req.user && !req.customer) {
      return next(new Error("Not authorized user", { cause: 403 }));
    }
    return next();
  });
};
