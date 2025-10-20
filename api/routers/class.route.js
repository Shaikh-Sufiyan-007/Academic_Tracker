import express from "express";
import { createClass, deleteClassWithId, getAllClasses, getAttendeeClass, getSingleClass, updateClassWithId } from "../controllers/class.controller.js";
import { authMiddleware } from "../auth/auth.js";

const router = express.Router();

router.post('/create', authMiddleware(['SCHOOL']), createClass)
router.get('/all', authMiddleware(['SCHOOL', 'TEACHER']), getAllClasses)
router.get('/single/:id', authMiddleware(['SCHOOL']), getSingleClass)
router.get('/attendee', authMiddleware(['TEACHER']), getAttendeeClass)
router.patch('/update/:id', authMiddleware(['SCHOOL']), updateClassWithId)
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteClassWithId)

export default router;