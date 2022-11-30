import express from "express";
import { DayOffController } from "../controllers/DayOff.controller.js";
import { UserController } from "../controllers/User.controllers.js";
import { upload } from "../middlewares/MulterMiddleWare.js";
import { DpRoleController } from "../controllers/Role.controllers.js";

const router = express.Router();

router.get("/user", UserController.get);
router.post("/user", upload.single("Avatar"), UserController.create);
router.patch("/user/:id", upload.single("Avatar"), UserController.update);
router.delete("/user/:id", UserController.getDelete);

router.get('/dayoff', DayOffController.show);
router.post('/dayoff/:id', DayOffController.upload);
router.get('/dayoff-soft', DayOffController.getDeleted);
router.delete('/dayoff-soft/:id', DayOffController.softDelete);
router.patch('/dayoff-soft/:id', DayOffController.restore);
router.delete('/dayoff/:id', DayOffController.delete);
router.get('/dayoff/:id', DayOffController.showItem);
router.patch('/dayoff/:id', DayOffController.update);
router.post('/dayoff/approve', DayOffController.approve);
router.post('/dayoff/reject', DayOffController.reject);
router.post('/test', DayOffController.test);



router.get("/role", DpRoleController.get);
router.post("/role", DpRoleController.create);
router.patch("/role/:id", DpRoleController.update);
router.delete("/role/:id", DpRoleController.delete);

export default router;
