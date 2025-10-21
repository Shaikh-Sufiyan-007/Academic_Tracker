import express from "express";
import { authMiddleware } from "../auth/auth.js";
import { checkAttendance, getAttendance, markAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post('/mark', authMiddleware(['TEACHER']), markAttendance)
router.get('/:studentId', authMiddleware(['SCHOOL', 'STUDENT']), getAttendance)
router.get('/check/:classId', authMiddleware(['TEACHER']), checkAttendance)

export default router