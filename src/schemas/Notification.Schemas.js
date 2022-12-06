import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
mongoose.Promise = global.Promise;
const NotificationDayOff = new Schema({
  Name: { type: String },
  DayOffFrom: { type: Date },
  DayOffTo: { type: Date },
  UserId: { type: String },
  Reason: { type: String },
  IsRead: { type: Number },
}, { timestamps: true });
NotificationDayOff.plugin(softDeletePlugin);
export const NotificationDayOffSchema = mongoose.model('db-dayoff', TableDayOff);
