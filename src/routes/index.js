import express from "express";
import { UserController } from "../controllers/User.controllers.js";
import { upload } from "../middlewares/MulterMiddleWare.js";
import { DpRoleController } from "../controllers/Role.controllers.js";

const router = express.Router();

router.get("/user", UserController.get);
router.post("/user", upload.single("Avatar"), UserController.create);
router.patch("/user/:id", upload.single("Avatar"), UserController.update);
router.delete("/user/:id", UserController.getDelete);
router.get("/user/:key",UserController.searchUser);

router.get("/role", DpRoleController.get);
router.post("/role", DpRoleController.create);
router.patch("/role/:id", DpRoleController.update);
router.delete("/role/:id", DpRoleController.delete);

export default router;
