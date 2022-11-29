import mongoose from "mongoose"
import { softDeletePlugin } from "soft-delete-plugin-mongoose";


mongoose.Promise = global.Promise;

const DropSchemaUser = new mongoose.Schema({
    RoleId:{
        type:String
    },
    Images: {
        type:String
    },
    Name: {
        type:String
    },
    Gmail: {
        type:String
    },
    Password: {
        type:String
    },

}, {timestamps:true});

DropSchemaUser.plugin(softDeletePlugin);
export const UserSchema = mongoose.model('dp-users', DropSchemaUser);