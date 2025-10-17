import express from "express";
import { authMiddleware } from "../auth/auth.js";
import { createNotice, deleteNoticeWithId, getAllNotices, updateNoticeWithId } from "../controllers/notice.controller.js";

const router = express.Router();

router.post('/create', authMiddleware(['SCHOOL']), createNotice)
router.get('/all', authMiddleware(['SCHOOL']), getAllNotices)
router.patch('/update/:id', authMiddleware(['SCHOOL']), updateNoticeWithId)
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteNoticeWithId)

export default router;