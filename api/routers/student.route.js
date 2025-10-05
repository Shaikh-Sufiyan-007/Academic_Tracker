import express from "express";
import { authMiddleware } from "../auth/auth.js";
import { deleteStudentWithId, getStudentOwnData, getStudentsWithQuery, getStudentWithId, loginStudent, registerStudent, updateStudent } from "../controllers/student.controller.js";

const router = express.Router();

router.post('/register', authMiddleware(['SCHOOL']), registerStudent)
router.get('/all', authMiddleware(['SCHOOL']), getStudentsWithQuery)
router.post('/login', loginStudent)
router.patch('/update/:id', authMiddleware(['SCHOOL']), updateStudent) // AUTHENTICATED USER FOR UPDATE
router.get('/fetch-single', authMiddleware(['STUDENT']), getStudentOwnData)
router.get('/fetch/:id', authMiddleware(['STUDENT']), getStudentWithId)
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteStudentWithId)

export default router