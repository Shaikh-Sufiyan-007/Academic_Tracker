import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    school: {type: mongoose.Schema.Types.ObjectId, ref: "School"},
    title: {type: String, required: true},
    message: {type: String, required: true},
    audience: {type: String, enum: ['student', 'teacher'], required: true},

    createdAt: {type: Date, default: new Date()}
})

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice