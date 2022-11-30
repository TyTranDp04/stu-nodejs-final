import mongoose from "mongoose"
import { softDeletePlugin } from "soft-delete-plugin-mongoose";


mongoose.Promise = global.Promise;

const UserGroup = new mongoose.Schema({
   UserId: {
        type:String,
        require: true,
    },
    GroupId: {
        type:String,
        require: true,
    },
    Name:{
        type:String,
        require: true,
    }
}, {timestamps:true});

UserGroup.plugin(softDeletePlugin);
export const UserGroupSchema = mongoose.model('dp-users-group', UserGroup);