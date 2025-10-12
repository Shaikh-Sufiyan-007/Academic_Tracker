import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import Exam from "../models/examination.model.js";
import Schedule from "../models/schedule.model.js";

export const createClass = async (req, res) => {
    try {
        const newClass = new Class({
            school: req.user.schoolId,
            class_text: req.body.class_text,
            class_num: req.body.class_num,
            branch_code: req.body.branch_code,
            branch_section: req.body.branch_section
        })

        await newClass.save();
        res.status(200).json({ success: true, message: "Class created successfully.", newClass });
    } catch (error) {
        console.log("Error in createClass Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllClasses = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const allClasses = await Class.find({ school: schoolId });
        res.status(200).json({ success: true, message: "Classes fetched successfully.", data: allClasses });
        
    } catch (error) {
        console.log("Error in getAllClasses Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getSingleClass = async(req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const classId = req.params.id;

        const singleClass = await Class.findOne({ _id: classId, school: schoolId }).populate("attendee");
        res.status(200).json({ success: true, message: "Single class fetched successfully.", data: singleClass });
    } catch (error) {
        console.log("Error in getSingleClass Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateClassWithId = async(req, res) => {
    try {
        let id = req.params.id;
        await Class.findOneAndUpdate({ _id: id}, {$set: {...req.body}});
        const classAfterUpdate = await Class.findOne({_id: id});
        res.status(200).json({ success: true, message: "Class updated successfully.", data: classAfterUpdate });

    } catch (error) {
        console.log("Error in updateClassWithId Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteClassWithId = async(req, res) => {
    try {
        let id = req.params.id;
        let schoolId = req.user.schoolId;
        
        const classStudentCount = (await Student.find({student_class: id, school: schoolId})).length;
        const classExamCount = (await Exam.find({class: id, school: schoolId})).length;
        const classScheduleCount = (await Schedule.find({class: id, school: schoolId})).length;

        if((classStudentCount === 0) && (classExamCount === 0)  && (classScheduleCount === 0)) {
            await Class.findOneAndDelete({_id: id, school: schoolId});
            res.status(200).json({ success: true, message: "Class deleted successfully." });
        } else {
            res.status(400).json({ success: false, message: "This class is already in use. " });
        }

    } catch (error) {
        console.log("Error in deleteClassWithId Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}