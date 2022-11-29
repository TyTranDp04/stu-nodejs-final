import mongoose from "mongoose"
import { softDeletePlugin } from "soft-delete-plugin-mongoose";

mongoose.Promise = global.Promise;

const RoleSchema = new mongoose.Schema({
    Id:{
        type: String
    },
    RoleName:{
        type: String
    }
})

RoleSchema.plugin(softDeletePlugin);
export const DpRoleSchema = mongoose.model('dp-role', RoleSchema);