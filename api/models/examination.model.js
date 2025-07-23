import mongoose from "mongoose";

const examinationSchema = new mongoose.Schema({
    school: {type: mongoose.Schema.Types.ObjectId, ref: "School"},
    examDate: {type: Date, required: true},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: "Subject"},
    examType: {type: String, required: true},
    class: {type: mongoose.Schema.Types.ObjectId, ref: "Class"},

    createdAt: {type: Date, default: new Date()},
})

const Examination = mongoose.model("Examination", examinationSchema);

export default Examination