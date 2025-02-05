import mongoose from "mongoose";
import { ROLES } from "../../common/constants.mjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(ROLES) },
});

export default mongoose.model("User", userSchema);
