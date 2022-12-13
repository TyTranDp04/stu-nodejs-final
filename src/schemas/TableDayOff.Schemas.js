import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
mongoose.Promise = global.Promise;
const TableDayOff = new Schema({
  Status: {type: Number},
  DayOffFrom: { type: Date },
  DayOffTo: { type: Date },
  UserId: { type: String },
  Reason: { type: String },
  Approve: { type: Array },
  Name: { type: String },
  Type: { type: Number },
  Quantity: { type: Number },
}, { timestamps: true });
TableDayOff.plugin(softDeletePlugin);
export const TableDayOffSchema = mongoose.model('db-dayoff', TableDayOff);
