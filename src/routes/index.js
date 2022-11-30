import express from "express";
import { UserController } from "../controllers/User.controllers.js";
import { upload } from "../middlewares/MulterMiddleWare.js";
import { DpRoleController } from "../controllers/Role.controllers.js"; 
import { middlewareController } from "../middlewares/User.middleware.js";
import { authController } from "../controllers/Auth.controller.js";

const router = express.Router();

router.get("/user",middlewareController.verifyToken, UserController.get);
router.post("/user", upload.single("Avatar"), UserController.create);
router.patch("/user/:id", upload.single("Avatar"), UserController.update);
router.delete("/user/:id", UserController.getDelete);

router.get("/role", DpRoleController.get);
router.post("/role", DpRoleController.create);
router.patch("/role/:id", DpRoleController.update);
router.delete("/role/:id", DpRoleController.delete);

router.post("/auth/login", authController.loginUser);
router.post("/auth/logout",middlewareController.verifyToken, authController.userLogout);

export default router;
