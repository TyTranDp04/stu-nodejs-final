import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
mongoose.Promise = global.Promise;
const HistoryDayOff = new Schema({
  RequestId: { type: String, require: true,
  },
  UserId: { type: String, require: true,
  },
  Status: { type: Object, require: true,
  },
  ReasonChange: { type: String, require: true,
  },
  Parent: { type: Array,  require: true, },
}, { timestamps: true });
HistoryDayOff.plugin(softDeletePlugin);
export const HistoryDayOffSchema = mongoose.model('db-historys', HistoryDayOff);
