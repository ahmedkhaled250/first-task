import morgan from "morgan";
import { handleError } from "./utils/errorHandling.js";
import superAdminAccount from "./utils/currentJop.js";
import userRouter from "./modules/user/user.router.js"
import customerRouter from "./modules/customer/customer.router.js"
import authRouter from "./modules/auth/auth.router.js"
import roleRouter from "./modules/role/role.router.js"
import cors from "cors"
const initApp = (app, express) => {
  const baseURL = process.env.BASEURL;
  app.use(cors())
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.MOOD == "DEV") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }
  superAdminAccount()
  app.use(`${baseURL}/auth`,authRouter);
  app.use(`${baseURL}/role`,roleRouter);
  app.use(`${baseURL}/user`,userRouter);
  app.use(`${baseURL}/customer`,customerRouter);
  app.use(`*`, (req, res, next) => {
    return next(new Error("In-valid url", { cause: 404 }));
  });
  app.use(handleError);
};
export default initApp;
