import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School"
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    gaurdian: {
        type: String,
        required: true
    },
    gaurdian_phone: {
        type: String,
        required: true
    },
    student_phone: {
        type: String,
        required: true
    },
    student_image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roll_num: {
        type: Number,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    branch_code: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Student = mongoose.model("Student", studentSchema);

export default Student