import express from "express";
import { authMiddleware } from "../auth/auth.js";
import { createNotice, deleteNoticeWithId, getAllNotices, getStudentNotices, getTeacherNotices, updateNoticeWithId } from "../controllers/notice.controller.js";

const router = express.Router();

router.post('/create', authMiddleware(['SCHOOL']), createNotice)
router.get('/all', authMiddleware(['SCHOOL']), getAllNotices)
router.get('/teacher', authMiddleware(['TEACHER']), getTeacherNotices)
router.get('/student', authMiddleware(['STUDENT']), getStudentNotices)
router.patch('/update/:id', authMiddleware(['SCHOOL']), updateNoticeWithId)
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteNoticeWithId)

export default router;