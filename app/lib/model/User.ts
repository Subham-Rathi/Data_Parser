import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address: String,
  pincode: String,
  city: String,
  state: String,
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);