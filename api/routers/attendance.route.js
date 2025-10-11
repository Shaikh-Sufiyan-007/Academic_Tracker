import express from "express";
import { authMiddleware } from "../auth/auth.js";
import { checkAttendance, getAttendance, markAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post('/marks', authMiddleware(['TEACHER']), markAttendance)
router.get('/:studentId', authMiddleware(['SCHOOL']), getAttendance)
router.get('/check/:classId', authMiddleware(['SCHOOL']), checkAttendance)

export default router