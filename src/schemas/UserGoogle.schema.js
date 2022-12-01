import mongoose from "mongoose";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";


mongoose.Promise = global.Promise;

const GoogleSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String

}, { timestamps: true });

GoogleSchema.plugin(softDeletePlugin);
export const UserGoogleSchema = mongoose.model('dp-google-users', GoogleSchema);