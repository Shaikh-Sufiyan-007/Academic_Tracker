import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import schoolRouter from "./routers/school.route.js"

dotenv.config();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

// MONGODB CONNECTION
 mongoose.connect(`mongodb://localhost:27017/academictracker`).then(db => {
    console.log("Database is connected successfully")
 }).catch(err => {
     console.log("Database is not connected ", err)
 })

 app.use('/api/school', schoolRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})