import { model, Schema, Types } from "mongoose";
const customerSchema = new Schema(
  {
    userName: String,
    firstName: { type: String, required: [true, "firstName is required"] },
    lastName: { type: String, required: [true, "lastName is required"] },
    email: { type: String, required: [true, "email is required"] },
    password: { type: String, required: [true, "password is required"] },
    phone: { type: String },
    gender: { type: String, default: "Male", enum: ["Male", "Female"] },
    image: { type: { secure_url: String, public_id: String } },
    DOB: Date,
    placeOfResidence: String,
    personalInterests: Array,
    changeTime: Date,
    code:Number,
    confirmEmail: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const customerModel = model("Customer", customerSchema);
export default customerModel;
