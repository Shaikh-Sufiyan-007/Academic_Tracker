import Examination from "../models/examination.model.js";

export const newExamination = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { date, subjectId, examType, classId } = req.body;
    const newExamination = new Examination({
      school: schoolId,
      examDate: date,
      subject: subjectId,
      examType: examType,
      class: classId,
    });

    const saveData = await newExamination.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Examination created successfully.",
        data: saveData,
      });
  } catch (error) {
    console.log("Error in newExamination Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllExaminations = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const examinations = await Examination.find({ school: schoolId });
    res
      .status(200)
      .json({
        success: true,
        message: "Examinations fetched successfully.",
        data: examinations,
      });
  } catch (error) {
    console.log("Error in getExamination Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllExaminationsByClass = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const classId = req.params.id;
    const examinations = await Examination.find({
      class: classId,
      school: schoolId,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "Examinations fetched successfully.",
        data: examinations,
      });
  } catch (error) {
    console.log("Error in getExamination Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExaminationWithId = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const examinationId = req.params.id;
    const { date, subjectId, examType } = req.body;
    await Examination.findOneAndUpdate(
      { _id: examinationId, school: schoolId },
      {
        $set: {
          examDate: date,
          subject: subjectId,
          examType: examType,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Examination updated successfully.",

      });
  } catch (error) {
    console.log("Error in updateExamination Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExaminationWithId = async(req,  res) => {
    try {
      const schoolId = req.user.schoolId;
      const examinationId = req.params.id;
      await Examination.findOneAndDelete({_id: examinationId, school: schoolId});
      res.status(200).json({ success: true, message: "Examination deleted successfully." });
    } catch (error) {
    console.log("Error in deleteExamination Controller :", error);
    res.status(500).json({ success: false, message: error.message });
    }   
}