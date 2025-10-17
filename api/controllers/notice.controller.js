import Notice from "../models/notice.model.js";

export const createNotice = async (req, res) => {
    try {
        const {title, message, audience} = req.body;
        const newNotice = new Notice({
            school: req.user.schoolId,
            title: title,
            message: message,
            audience: audience
        })

        await newNotice.save();
        res.status(200).json({ success: true, message: "Notice created successfully.", data: newNotice });
    } catch (error) {
        console.log("Error in createNotice Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllNotices = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const allNotices = await Notice.find({ school: schoolId });
        res.status(200).json({ success: true, message: "Notice fetched successfully.", data: allNotices });
        
    } catch (error) {
        console.log("Error in getAllNotices Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateNoticeWithId = async(req, res) => {
    try {
        let id = req.params.id;
        await Notice.findOneAndUpdate({ _id: id}, {$set: {...req.body}});
        const NoticeAfterUpdate = await Notice.findOne({_id: id});
        res.status(200).json({ success: true, message: "Notice updated successfully.", data: NoticeAfterUpdate });

    } catch (error) {
        console.log("Error in updateNoticeWithId Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteNoticeWithId = async(req, res) => {
    try {
        let id = req.params.id;
        let schoolId = req.user.schoolId;
        
            await Notice.findOneAndDelete({_id: id, school: schoolId});
            res.status(200).json({ success: true, message: "Notice deleted successfully." });

    } catch (error) {
        console.log("Error in deleteNoticeWithId Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
}