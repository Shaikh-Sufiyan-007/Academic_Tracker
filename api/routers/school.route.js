import express from "express";
import { getAllSchools, getSchoolOwnData, loginSchool, registerSchool, updateSchool } from "../controllers/school.controller.js";

const router = express.Router();

router.post('/register', registerSchool)
router.get('/all', getAllSchools)
router.post('/login', loginSchool)
router.patch('/update', updateSchool)
router.get('fetch-single', getSchoolOwnData)

export default router