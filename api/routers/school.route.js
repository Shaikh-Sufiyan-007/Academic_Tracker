import express from "express";
import { getAllSchools, getSchoolOwnData, loginSchool, registerSchool, updateSchool } from "../controllers/school.controller.js";
import { authMiddleware } from "../auth/auth.js";

const router = express.Router();

router.post('/register', registerSchool)
router.get('/all', getAllSchools)
router.post('/login', loginSchool)
router.patch('/update', authMiddleware(['SCHOOL']), updateSchool) // AUTHENTICATED USER FOR UPDATE
router.get('/fetch-single', authMiddleware(['SCHOOL']), getSchoolOwnData)

export default router