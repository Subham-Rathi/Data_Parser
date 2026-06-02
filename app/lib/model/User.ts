import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    mobile: String,
    address: String,
    pincode: String,
    city: String,
    state: String,
    tag: {
      type: String,
      enum: ["Retail", "Wholesale"],
      default: "Retail",
    },
    amount: Number,
  },
  { collection: "user" }
);

if (mongoose.models.User && !mongoose.models.User.schema.path("amount")) {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model("User", UserSchema);
