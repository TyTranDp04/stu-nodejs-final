import express from "express";
import { TableDayOffController } from "../controllers/TableDayOff.Controller.js";
const router = express.Router();


router.get('/dayoff', TableDayOffController.show);
router.post('/dayoff', TableDayOffController.upload);
router.get('/dayoff-soft', TableDayOffController.getDeleted);
router.delete('/dayoff-soft/:id', TableDayOffController.softDelete);
router.patch('/dayoff-soft/:id', TableDayOffController.restore);
router.delete('/dayoff/:id', TableDayOffController.delete);
router.get('/dayoff/:id', TableDayOffController.showItem);
router.patch('/dayoff/:id', TableDayOffController.update);

export default router;