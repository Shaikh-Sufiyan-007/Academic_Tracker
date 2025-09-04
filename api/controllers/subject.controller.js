import Subject from "../models/subject.model.js";
import Student from "../models/student.model.js";
import Exam from "../models/examination.model.js";
import Schedule from "../models/schedule.model.js";

export const getAllSubjects = async(req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const allSubjects = await Subject.find({ school: schoolId });
        res.status(200).json({ success: true, message: "Subjects fetched successfully.", data: allSubjects });

    } catch (error) {
        console.log("Error in getAllSubjects Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const createSubject = async(req, res) => {
    try {
        const newSubject = new Subject({
            school: req.user.schoolId,
            subject_name: req.body.subject_name,
            subject_code: req.body.subject_code,
            credits: req.body.credits,
            subject_type: req.body.subject_type,
            branch_name: req.body.branch_name,
            branch_code: req.body.branch_code,
        })
        
        await newSubject.save();
        res.status(200).json({ success: true, message: "Subject created successfully.", newSubject });

    } catch (error) {    
        console.log("Error in createSubject Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateSubjectWithId = async(req, res) => {
    try {
        let id = req.params.id;
        await Subject.findOneAndUpdate({_id: id}, {$set: {...req.body}});
        const subjectAfterUpdate = await Subject.findOne({_id: id});
        res.status(200).json({ success: true, message: "Subject updated successfully.", data: subjectAfterUpdate });

    } catch (error) {
        console.log("Error in updateSUbjectWithId Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteSubjectWithId = async(req, res) => {
    try {
        let id = req.params.id;
        let schoolId = req.user.schoolId;

        const SubjectExamCount = (await Exam.find({subject: id, school: schoolId})).length;
        const SubjectScheduleCount = (await Schedule.find({subject: id,school: schoolId})).length;

        if((SubjectExamCount === 0) && (SubjectScheduleCount === 0)) {
            await Subject.findOneAndDelete({_id: id, school: schoolId});
            res.status(200).json({ success: true, message: "Subject deleted successfully." });
        } else {
            res.status(400).json({ success: false, message: "This subject is already in use. " });
        }
    } catch (error) {
        console.log("Error in deleteSubjectWithId Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}