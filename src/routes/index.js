import express from "express";
import { DayOffController } from "../controllers/DayOff.controller.js";
import { UserController } from "../controllers/User.controllers.js";
import { upload } from "../middlewares/MulterMiddleWare.js";
import { DpRoleController } from "../controllers/Role.controllers.js"; 
import { Usermiddleware } from "../middlewares/User.middleware.js";
import { authController } from "../controllers/Auth.controller.js";
import {GroupController} from '../controllers/Group.controllers.js'
import {UserGroupController} from '../controllers/UserGroup.controllers.js'


const router = express.Router();

router.get("/user",Usermiddleware.verifyToken, UserController.get);
router.post("/user", upload.single("Avatar"), UserController.create);
router.patch("/user/:id", upload.single("Avatar"), UserController.update);
router.delete("/user/:id", UserController.getDelete);


router.post('/dayoff', DayOffController.show);
router.post('/newdayoff', DayOffController.upload);
router.post('/dayoff-soft', DayOffController.getDeleted);
router.delete('/dayoff-soft/:id', DayOffController.softDelete);
router.patch('/dayoff-soft/:id', DayOffController.restore);
router.delete('/dayoff/:id', DayOffController.delete);
router.get('/dayoff/:id', DayOffController.showItem);
router.patch('/dayoff/:id', DayOffController.update);
router.post('/approve', DayOffController.approve);
router.post('/reject', DayOffController.reject);


router.get("/role", DpRoleController.get);
router.post("/role", DpRoleController.create);
router.patch("/role/:id", DpRoleController.update);
router.delete("/role/:id", DpRoleController.delete);

router.post("/auth/login", authController.loginUser);
router.post("/auth/logout",Usermiddleware.verifyToken, authController.userLogout);

router.get("/user-group", UserGroupController.get);
router.post("/user-group", UserGroupController.create);
router.patch("/user-group/:id", UserGroupController.update);
router.delete("/user-group/:id", UserGroupController.getDelete);

router.get("/group", GroupController.get);
router.post("/group", GroupController.create);
router.patch("/group/:id", GroupController.update);
router.delete("/group/:id", GroupController.getDelete);

router.patch("/change-password/:_id", authController.update);

export default router;
