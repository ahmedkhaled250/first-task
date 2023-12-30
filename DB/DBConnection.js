import mongoose from "mongoose";
const DBConnection = async () => {
  return await mongoose
    .connect(process.env.DBURI)
    .then(console.log(`connected DB`))
    .catch((err) => console.log(`Fail to connect DB........${err}`));
};
export default DBConnection