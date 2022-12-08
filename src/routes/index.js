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
router.post("/user/:id", upload.single("img"), UserController.update);
router.delete("/user/:id", UserController.getDelete);


router.get('/dayoff',Usermiddleware.verifyToken, DayOffController.show);
router.post('/dayoff',Usermiddleware.verifyToken, DayOffController.upload);
router.get('/dayoff-soft',Usermiddleware.verifyToken, DayOffController.getDeleted);
router.delete('/dayoff-soft/:id',Usermiddleware.verifyToken, DayOffController.softDelete);
router.patch('/dayoff-soft/:id',Usermiddleware.verifyToken, DayOffController.restore);
router.delete('/dayoff/:id',Usermiddleware.verifyToken, DayOffController.delete);
router.get('/dayoff/:id',Usermiddleware.verifyToken, DayOffController.showItem);
router.patch('/dayoff/:id',Usermiddleware.verifyToken, DayOffController.update);
router.post('/approve',Usermiddleware.verifyToken, DayOffController.approve);
router.post('/reject',Usermiddleware.verifyToken, DayOffController.reject);


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
