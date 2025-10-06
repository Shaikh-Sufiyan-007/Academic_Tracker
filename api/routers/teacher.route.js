import express from "express";
import { authMiddleware } from "../auth/auth.js";
import { deleteTeacherWithId, getTeacherOwnData, getTeachersWithQuery, getTeacherWithId, loginTeacher, registerTeacher, updateTeacher } from "../controllers/teacher.controller.js";


const router = express.Router();

router.post('/register', authMiddleware(['SCHOOL']), registerTeacher)
router.get('/all', authMiddleware(['SCHOOL']), getTeachersWithQuery)
router.post('/login', loginTeacher)
router.patch('/update/:id', authMiddleware(['SCHOOL']), updateTeacher) // AUTHENTICATED USER FOR UPDATE
router.get('/fetch-single', authMiddleware(['TEACHER']), getTeacherOwnData)
router.get('/fetch/:id', authMiddleware(['TEACHER']), getTeacherWithId)
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteTeacherWithId)

export default router