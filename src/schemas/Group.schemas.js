import mongoose from "mongoose"
import { softDeletePlugin } from "soft-delete-plugin-mongoose";


mongoose.Promise = global.Promise;

const Group = new mongoose.Schema({
    Name:{
        type:String,
        require: true,
    }
}, {timestamps:true});

Group.plugin(softDeletePlugin);
export const GroupSchema = mongoose.model('dp-group', Group);