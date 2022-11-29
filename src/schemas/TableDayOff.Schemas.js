import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
mongoose.Promise = global.Promise;
const TableDayOff = new Schema({
  Status: {type: String},
  DayOffFrom: { type: String },
  DayOffTo: { type: String },
  UserId: { type: String },
}, { timestamps: true });
TableDayOff.plugin(softDeletePlugin);
export const TableDayOffSchema = mongoose.model('db-dayoff', TableDayOff);
