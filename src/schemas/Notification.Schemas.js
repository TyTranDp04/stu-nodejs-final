import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
mongoose.Promise = global.Promise;
const NotificationDayOff = new Schema({
  Status: { type: Number, require: true,
  },
  Name: { type: String, require: true,
  },
  DayOffFrom: { type: Date, require: true,
  },
  DayOffTo: { type: Date,  require: true, },
  UserId: { type: String, require: true, },
  Reason: { type: String, require: true,},
  ReasonChange: { type: String},
  Type: { type: Number, require: true,},
  Quantity: { type: Number, require: true,},
  UserRead: { type: Array },
  GroupId: { type: String}
}, { timestamps: true });
NotificationDayOff.plugin(softDeletePlugin);
export const NotificationDayOffSchema = mongoose.model('db-notification', NotificationDayOff);
