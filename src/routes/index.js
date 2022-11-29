import express from "express";
import { UserController } from "../controllers/User.controllers.js";
import { upload } from "../middlewares/MulterMiddleWare.js";
const router = express.Router();

router.get("/user", UserController.get);
router.post("/user", upload.single("Avatar"), UserController.create);
router.patch("/user/:id", upload.single("Avatar"), UserController.update);
router.delete("/user/:id", UserController.getDelete);

export default router;
