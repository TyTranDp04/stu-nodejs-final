import mongoose from "mongoose";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";


mongoose.Promise = global.Promise;

const DropSchemaUser = new mongoose.Schema({
  RoleID: {
    type: String,
    require: true,
  },
  Avatar: {
    type: String,
  },
  Name: {
    type: String,
    unique: true
  },
  GroupID: {
    type: Array,
  },
  Gmail: {
    type: String,
    require: true,
    unique: true
    },
  Password: {
    type: String,
    require: true,
  },
  Address: {
    type: String,
  },
  Phone: {
    type: Number,
  },

}, { timestamps: true });

DropSchemaUser.plugin(softDeletePlugin);
export const UserSchema = mongoose.model('dp-users', DropSchemaUser);