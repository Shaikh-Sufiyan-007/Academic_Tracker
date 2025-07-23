import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    school: {type: mongoose.Schema.Types.ObjectId, ref: "School"},
    student: {type: mongoose.Schema.Types.ObjectId, ref: "Student"},
    class: {type: mongoose.Schema.Types.ObjectId, ref: "Class"},
    date: {type: Date, required: true},
    status: {type: String, enums: ["Present", "Absent"], default: "Absent"},

    createdAt: {type: Date, default: new Date()},
})

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance