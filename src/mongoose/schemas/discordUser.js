import mongoose from "mongoose";

const discordUserSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String },
});

export default mongoose.model("DiscordUser", discordUserSchema);
