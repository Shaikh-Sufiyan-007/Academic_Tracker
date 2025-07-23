import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  school: {type: mongoose.Schema.Types.ObjectId, ref: "School"},
  teacher: {type: mongoose.Schema.Types.ObjectId, ref: "Teacher"},
  subject: {type: mongoose.Schema.Types.ObjectId, ref: "Subject"},
  class: {type: mongoose.Schema.Types.ObjectId, ref: "Class",},
  startTime: {type: Date, required: true,},
  endTime: { type: Date, required: true },

  createdAt: {type: Date, default: new Date()},
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
