import express from "express";
import { createSubject, deleteSubjectWithId, getAllSubjects, updateSubjectWithId } from "../controllers/subject.controller.js";
import { authMiddleware } from "../auth/auth.js";

const router = express.Router();

router.get('/all', authMiddleware(['SCHOOL']), getAllSubjects)
router.post('/create', authMiddleware(['SCHOOL']), createSubject)
router.patch('/update/:id', authMiddleware(['SCHOOL']), updateSubjectWithId)
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteSubjectWithId)

export default router