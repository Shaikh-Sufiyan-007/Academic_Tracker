import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School"
    },
    subject_name: {
        type: String,
        required: true
    },
    subject_code: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: new Date()
    }
    
})

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject