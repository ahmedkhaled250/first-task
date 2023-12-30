import { model, Schema, Types } from "mongoose";
const roleSchema = new Schema(
  {
    roleName: { type: String, required: [true, "roleName is required"] ,unique:true},
  },
  {
    timestamps: true,
  }
);
const roleModel = model("Role",roleSchema);
export default roleModel;
