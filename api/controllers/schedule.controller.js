
import Schedule from "../models/schedule.model.js";

export const getScheduleWithClass = async(req, res) => {
    try {
        const classId = req.params.id;
        const schoolId = req.user.schoolId;
        const schedules = await Schedule.find({ school: schoolId, class: classId });
        res.status(200).json({ success: true, message: "Subjects fetched successfully.", data: schedules });

    } catch (error) {
        console.log("Error in getScheduleWithClass Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const createSchedule = async(req, res) => {
    try {
        const newSchedule = new Schedule({
            school: req.user.schoolId,
            teacher: req.body.teacher,
            subject: req.body.subject,
            class: req.body.selectedClass,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })
        
        await newSchedule.save();
        res.status(200).json({ success: true, message: "Schedule created successfully.", newSchedule });

    } catch (error) {    
        console.log("Error in createSchedule Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateScheduleWithId = async(req, res) => {
    try {
        let id = req.params.id;
        await Schedule.findOneAndUpdate({_id: id}, {$set: {...req.body}});
        const scheduleAfterUpdate = await Schedule.findOne({_id: id});
        res.status(200).json({ success: true, message: "Schedule updated successfully.", data: scheduleAfterUpdate });

    } catch (error) {
        console.log("Error in updateScheduleWithId Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteScheduleWithId = async(req, res) => {
    try {
        let id = req.params.id;
        let schoolId = req.user.schoolId;

        await Schedule.findOneAndDelete({_id: id, school: schoolId});
        res.status(200).json({ success: true, message: "Schedule deleted successfully." });

    } catch (error) {
        console.log("Error in deleteScheduleWithId Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}