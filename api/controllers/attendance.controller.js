import Attendance from "../models/attendance.model.js";
import moment from "moment";

export const markAttendance = async(req, res) => {
    try {
        const {studentId, date, status, classId} = req.body;
        const schoolId = req.user.schoolId;
        
        const newAttendance = new Attendance({
            school: schoolId,
            student: studentId,
            class: classId,
            date: date,
            status: status
        })

        const savedAttendance = await newAttendance.save();
        res.status(201).json({success: true, message: "Attendance marked successfully.", data: savedAttendance});
    } catch (error) {
        console.log("Error in markAttendance Controller :", error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const getAttendance = async(req, res) => {
    try {
        const {studentId} = req.params;
        
        const attendance = await Attendance.find({ student: studentId}).populate("student");

        res.status(200).json({success: true, message: "Attendance fetched successfully.", data: attendance});
    } catch (error) {
        console.log("Error in getAttendance Controller :", error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const checkAttendance = async(req, res) => {
    try {
        const today = moment().startOf('day')
        const classId = req.params;
        const attendanceForToday = await Attendance.findOne({
            class: classId,
            date: {
                $gt: today.toDate(),
                $lt: moment(today).endOf('day').toDate()
            }
        })

        if(attendanceForToday) {
            res.status(200).json({attendanceTaken: true, message: "Attendance already taken",});
        } else {
            return res.status(200).json({attendanceTaken: false, message: "Attendance not taken"});
        }
    } catch (error) {
        console.log("Error in checkAttendance Controller :", error);
        res.status(500).json({success: false, message: error.message});
    }
}