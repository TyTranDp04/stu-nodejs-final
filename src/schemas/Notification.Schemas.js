import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
mongoose.Promise = global.Promise;
const NotificationDayOff = new Schema({
  Name: { type: String, require: true,
  },
  DayOffFrom: { type: Date, require: true,
  },
  DayOffTo: { type: Date,  require: true, },
  UserId: { type: String, require: true, },
  Reason: { type: String, require: true,},
  IsRead: { type: Number },
}, { timestamps: true });
NotificationDayOff.plugin(softDeletePlugin);
export const NotificationDayOffSchema = mongoose.model('db-notification', NotificationDayOff);
