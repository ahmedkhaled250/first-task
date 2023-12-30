import { findOne, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import customerModel from "../../../../DB/models/Customer.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import sendEmail from "../../../utils/sendEmail.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
import userModel from "../../../../DB/models/User.js";
export const signup = asyncHandler(async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const { email, password } = req.body;
  const checkEmail = await findOne({
    model: customerModel,
    condition: { email },
    select: "email",
  });
  if (checkEmail) {
    return next(new Error("Email exist", { cause: 409 }));
  }
  const hashPassword = hash({ plaintext: password });
  req.body.password = hashPassword;
  req.body.userName = `${req.body.firstName}` + ` ${req.body.lastName}`;
  const newCustomer = new customerModel(req.body);
  const token = generateToken({
    payload: { email },
    signature: process.env.EMAILTOKEN,
    expiresIn: 60 * 5,
  });
  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAILTOKEN,
    expiresIn: 60 * 60 * 24,
  });

  const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
  const rfLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshEmail/${refreshToken}`;

  const message = `<!DOCTYPE html>
      <html>
      <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
      <style type="text/css">
      body{background-color: #88BDBF;margin: 0px;}
      </style>
      <body style="margin:0px;"> 
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
      <tr>
      <td>
      <table border="0" width="100%">
      <tr>
      <td>
      <h1>
          <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
      </h1>
      </td>
      <td>
      <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
      <tr>
      <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
      <img width="50px" height="50px" src="${process.env.logo}">
      </td>
      </tr>
      <tr>
      <td>
      <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
      </td>
      </tr>
      <tr>
      <td>
      <p style="padding:0px 100px;">
      </p>
      </td>
      </tr>
      <tr>
      <td>
      <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
      </td>
      </tr>
      <tr>
      <td>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new  email </a>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
      <tr>
      <td>
      <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
      </td>
      </tr>
      <tr>
      <td>
      <div style="margin-top:20px;">
    
      <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
      
      <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
      </a>
      
      <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
      </a>
    
      </div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </table>
      </body>
      </html>`;
  const info = await sendEmail({
    to: email,
    subject: "Confirmation-Email",
    message,
  });
  if (!info) {
    return next(new Error("Email rejected", { cause: 400 }));
  }
  await newCustomer.save();
  return res.status(201).json({ message: "Done", customer: newCustomer._id });
});
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = verifyToken({ token, signature: process.env.EMAILTOKEN });
  if (!decoded?.email) {
    return next(new Error("In-valid token paylaod", { cause: 400 }));
  }
  const updateCustomer = await findOneAndUpdate({
    model: customerModel,
    condition: { email: decoded.email },
    data: { confirmEmail: true },
  });
  if (!updateCustomer) {
    return next(
      new Error("In-valid any account by this email", { cause: 404 })
    );
  }
  return res.status(200).json({ message: "Done" });
});
export const refreshEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = verifyToken({ token, signature: process.env.EMAILTOKEN });
  if (!decoded?.email) {
    return next(new Error("Invalid token payload", { cause: 400 }));
  }
  const customer = await findOne({
    model: customerModel,
    condition: { email: decoded.email },
  });
  if (customer.confirmEmail) {
    return next(new Error("Already confirmed", { cause: 400 }));
  }
  const newToken = generateToken({
    payload: { email: decoded.email },
    signature: process.env.EMAILTOKEN,
    expiresIn: 60 * 2,
  });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
  const rfLink = `${req.protocol}://${req.headers.host}/auth/refreshEmail/${token}`;
  const message = `<!DOCTYPE html>
      <html>
      <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
      <style type="text/css">
      body{background-color: #88BDBF;margin: 0px;}
      </style>
      <body style="margin:0px;"> 
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
      <tr>
      <td>
      <table border="0" width="100%">
      <tr>
      <td>
      <h1>
          <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
      </h1>
      </td>
      <td>
      <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
      <tr>
      <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
      <img width="50px" height="50px" src="${process.env.logo}">
      </td>
      </tr>
      <tr>
      <td>
      <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
      </td>
      </tr>
      <tr>
      <td>
      <p style="padding:0px 100px;">
      </p>
      </td>
      </tr>
      <tr>
      <td>
      <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
      </td>
      </tr>
      <tr>
      <td>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new  email </a>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
      <tr>
      <td>
      <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
      </td>
      </tr>
      <tr>
      <td>
      <div style="margin-top:20px;">
  
      <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
      
      <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
      </a>
      
      <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
      </a>
  
      </div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </table>
      </body>
      </html>`;
  const info = await sendEmail({
    to: decoded.email,
    subject: "Confirmation-Email",
    message,
  });
  if (!info) {
    return next(new Error("Email rejected", { cause: 400 }));
  }
  return res.status(200).json({ message: "Go to confirm your email" });
});
export const signin = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;
  let checkUser;
  if (!name && !email) {
    return next(new Error("You've to send name or email", { cause: 400 }));
  } else if (name && email) {
    return next(
      new Error("You've to send only one of the name or email", { cause: 400 })
    );
  } else if (name && !email) {
    checkUser = await findOne({
      model: userModel,
      condition: { name: name.toLowerCase() },
    });
    if (!checkUser) {
      return next(new Error("In-valid user has this name", { cause: 404 }));
    }
  } else if (!name && email) {
    checkUser = await findOne({ model: customerModel, condition: { email } });
    if (!checkUser) {
      return next(
        new Error("In-valid customer has this email", { cause: 404 })
      );
    }
    if (!checkUser.confirmEmail) {
      return next(new Error("Confirm your email first", { cause: 400 }));
    }
  }
  if (checkUser.isBlocked) {
    return next(new Error("Your account is blocked", { cause: 400 }));
  }
  const match = compare({ plaintext: password, hashValue: checkUser.password });
  if (!match) {
    return next(new Error("Password miss match", { cause: 400 }));
  }
  if (!checkUser.role) {
    checkUser.isActive = true;
    await checkUser.save();
  }
  const token = generateToken({
    payload: { id: checkUser._id },
    expiresIn: 60 * 60 * 24,
  });
  const refresh_token = generateToken({
    payload: { id: checkUser._id },
    expiresIn: 60 * 60 * 24 * 365,
  });
  return res.status(200).json({ message: "Done", token, refresh_token });
});
export const logout = asyncHandler(async (req, res, next) => {
  const { customer } = req;
  if (!customer.isActive) {
    return next(new Error("Go to login", { cause: 400 }));
  }
  customer.isActive = false;
  await customer.save();
  return res.status(200).json({ message: "Done" });
});
