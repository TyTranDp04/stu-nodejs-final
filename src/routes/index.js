import express from "express";
import { UserController } from "../controllers/User.controllers.js";
import { upload } from "../middlewares/MulterMiddleWare.js";
const router = express.Router();

router.get("/user", UserController.get);
router.post("/user", upload.single("Images"), UserController.create);
router.patch("/user/:id", upload.single("Images"), UserController.update);
router.delete("/user/:id", UserController.getDelete);

export default router;
