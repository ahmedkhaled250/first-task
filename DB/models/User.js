import { model, Schema, Types } from "mongoose";
const userSchema = new Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    password: { type: String, required: [true, "password is required"] },
    DOB: Date,
    role: {
      type: [Types.ObjectId],
      ref: "Role",
      required: [true, "role is required"],
    },
  },
  {
    timestamps: true,
  }
);
const userModel = model("User",userSchema);
export default userModel;
