import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School"
    },
    class_text: {
        type: String,
        required: true
    },
    class_num: {
        type: String,
        required: true 
    },
    attendee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    },
    createAt: {
        type: Date,
        default: new Date()
    }
},{timestamps: true})

const Class = mongoose.model("Class", classSchema);

export default Class