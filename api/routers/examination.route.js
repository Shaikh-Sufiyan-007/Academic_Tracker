import express from "express";
import { authMiddleware } from "../auth/auth.js";
import { deleteExaminationWithId, getAllExaminations, getAllExaminationsByClass, newExamination, updateExaminationWithId } from "../controllers/examination.controller.js";

const router = express.Router();

router.post('/create', authMiddleware(['SCHOOL']), newExamination)
router.get('/all', authMiddleware(['SCHOOL']), getAllExaminations)
router.get('/class/:id', authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), getAllExaminationsByClass)
router.post('/update/:id', authMiddleware(['SCHOOL']), updateExaminationWithId)
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteExaminationWithId)

export default router;