import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import schoolRouter from "./routers/school.route.js"
import classRouter from "./routers/class.route.js"
import subjectRouter from "./routers/subject.route.js"
import studentRouter from "./routers/student.route.js"

dotenv.config();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const corsOption = {exposedHeaders: 'Authorization'}
app.use(cors(corsOption))
app.use(cookieParser())

// MONGODB CONNECTION
 mongoose.connect(`mongodb://localhost:27017/academictracker`).then(db => {
    console.log("Database is connected successfully")
 }).catch(err => {
     console.log("Database is not connected ", err)
 })

 app.use('/api/school', schoolRouter)
 app.use('/api/class', classRouter)
 app.use('/api/subject', subjectRouter)
 app.use('/api/student', studentRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})