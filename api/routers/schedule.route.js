import express from "express";
import { authMiddleware } from "../auth/auth.js";
import { createSchedule, deleteScheduleWithId, getScheduleWithClass, updateScheduleWithId } from "../controllers/schedule.controller.js";

const router = express.Router();

router.post('/create', authMiddleware(['SCHOOL']), createSchedule)
router.get('/fetch-with-class/:id', authMiddleware(['SCHOOL']), getScheduleWithClass)
router.patch('/update/:id', authMiddleware(['SCHOOL']), updateScheduleWithId)
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteScheduleWithId)

export default router;