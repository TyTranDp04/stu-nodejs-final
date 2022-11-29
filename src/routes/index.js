import express from "express";
import { DpRoleController } from "../controllers/Role.controllers.js";

const router = express.Router();

router.get("/role", DpRoleController.get);
router.post("/role", DpRoleController.create);
router.patch("/role/:id", DpRoleController.update);
router.delete("/role/:id", DpRoleController.delete);


export default router;