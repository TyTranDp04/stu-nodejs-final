import express from "express";
import { DayOffController } from "../controllers/DayOff.Controller.js";
const router = express.Router();


router.get('/dayoff', DayOffController.show);
router.post('/dayoff', DayOffController.upload);
router.get('/dayoff-soft', DayOffController.getDeleted);
router.delete('/dayoff-soft/:id', DayOffController.softDelete);
router.patch('/dayoff-soft/:id', DayOffController.restore);
router.delete('/dayoff/:id', DayOffController.delete);
router.get('/dayoff/:id', DayOffController.showItem);
router.patch('/dayoff/:id', DayOffController.update);
router.post('/dayoff/approve', DayOffController.approve);
router.post('/dayoff/reject', DayOffController.reject);
router.post('/test', DayOffController.test);




export default router;