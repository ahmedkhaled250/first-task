import { nanoid } from "nanoid";
import { create, findOne } from "../../DB/DBMethods.js";
import bcrypt from "bcryptjs";
import userModel from "../../DB/models/User.js";
import { asyncHandler } from "./errorHandling.js";
import roleModel from "../../DB/models/Role.js";
import sendEmail from "./sendEmail.js";

const superAdminAccount = async () => {
  const checkRole = await findOne({
    model: roleModel,
    condition: { roleName: "SuperAdmin" },
  });
  let role;
  if (!checkRole) {
    role = await create({ model: roleModel, data: { roleName: "SuperAdmin" } });
  } else {
    role = checkRole;
  }
  const checkSuperAdmin = await findOne({
    model: userModel,
    condition: { role: { $in: [role._id] } },
  });
  if (!checkSuperAdmin) {
    const password = nanoid();
    const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    const user = await create({
      model: userModel,
      data: { name: "SuperAdmin", password: hash, role: [role._id] },
    });
    const message = `
    <h1> Your account as Admin is : <h1/>
    <h2>name : ${user.name}<h2/>
    <h2>password : ${password}<h2/>
    `;
    await sendEmail({
      to: "ahmedkhaled56745@gmail.com",
      subject: "Admin account",
      message,
    });
  }
};
export default superAdminAccount;
