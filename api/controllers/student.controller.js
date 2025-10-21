import formidable from "formidable";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

// AUTHENTICATION - Student, STUDENT AND TEACHER

export const registerStudent = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const student = await Student.findOne({ email: fields.email });
      if (student) {
        return res
          .status(409)
          .json({ success: false, message: "Student already exists." });
      }

      const photo = files.image;
      let filepath = photo.filepath;
      let originalFilename = photo.originalFilename.replace(" ", "_");
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      let newPath = path.join(
        __dirname,
        process.env.STUDENT_IMAGE_PATH,
        originalFilename
      );

      let photoData = fs.readFileSync(filepath);
      fs.writeFileSync(newPath, photoData);

      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hash(fields.password, salt);
      const newStudent = new Student({
        school: req.user.schoolId,
        name: fields.name,
        email: fields.email,
        password: hashPassword,
        age: fields.age,
        gender: fields.gender,
        gaurdian: fields.gaurdian,
        gaurdian_phone: fields.gaurdian_phone,
        student_phone: fields.student_phone,
        student_phone: fields.student_phone,
        roll_num: fields.roll_num,
        branch: fields.branch,
        year: fields.year,
        student_image: originalFilename,
      });

      const savedStudent = await newStudent.save();
      res.status(201).json({
        success: true,
        data: savedStudent,
        message: "Student registered successfully.",
      });
    });
  } catch (error) {
    console.error("Error in registerStudent Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (student) {
      const isAuth = bcrypt.compareSync(password, student.password);
      if (isAuth) {
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
          {
            id: student._id,
            schoolId: student.school,
            name: student.student_name,
            image_url: student.student_image,
            role: "STUDENT",
          },
          jwtSecret
        );

        res.header("Authorization", token);

        res.status(200).json({
          success: true,
          message: "Student logged in successfully.",
          user: {
            id: student._id,
            schoolId: student.school,
            name: student.student_name,
            image_url: student.student_image,
            role: "STUDENT",
          },
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials." });
      }
    } else {
      res.status(404).json({ success: false, message: "Student not found." });
    }
  } catch (error) {
    console.error("Error in loginStudent Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentsWithQuery = async (req, res) => {
  try {
    const filterQuery = {};
    const schoolId = req.user.schoolId;
    filterQuery["school"] = schoolId;

    if (req.query.search) {
      filterQuery["name"] = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.branch) {
      filterQuery["branch"] = req.query.branch;
    }

    const students = await Student.find(filterQuery)
      .populate("branch")
      .select(["-password"]);
    res
      .status(200)
      .json({
        success: true,
        message: "Students fetched successfully.",
        students,
      });
  } catch (error) {
    console.error("Error in getAllStudents Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentOwnData = async (req, res) => {
  try {
    const id = req.user.id;
    const schoolId = req.user.schoolId;
    const student = await Student.findById({ _id: id, school: schoolId }).populate("branch")
      .select(["-password"]);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Student data fetched successfully.",
        student,
      });
  } catch (error) {
    console.error("Error in getStudentOwnData Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;

    const student = await Student.findOne({ _id: id, school: schoolId }).select(
      ["-password"]
    );
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Student data fetched successfully.",
        student,
      });
  } catch (error) {
    console.error("Error in getStudentWithId Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const student = await Student.findOne({ _id: id, school: schoolId });
      if (files.image) {
        const photo = files.image;
        let filepath = photo.filepath;
        let originalFilename = photo.originalFilename.replace(" ", "_");

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        if (student.student_image) {
          let oldImagePath = path.join(
            __dirname,
            process.env.STUDENT_IMAGE_PATH,
            student.student_image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
              if (err) console.log("Error in deleting old image :", err);
            });
          }
        }

        let newPath = path.join(
          __dirname,
          process.env.STUDENT_IMAGE_PATH,
          originalFilename
        );
        let photoData = fs.readFileSync(filepath);
        fs.writeFileSync(newPath, photoData);

        Object.keys(fields).forEach((field) => {
          student[field] = fields[field];
        });
        student["student_image"] = originalFilename;

        if (fields.password) {
          const salt = await bcrypt.genSaltSync(10);
          const hashPassword = await bcrypt.hash(fields.password, salt);
          student["password"] = hashPassword;
        }

      } else {
        Object.keys(fields).forEach((field) => {
          student[field] = fields[field];
        });
      }

      await student.save();
      res
        .status(200)
        .json({
          success: true,
          message: "Student updated successfully.",
          student,
        });
    });
  } catch (error) {
    console.error("Error in registerStudent Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudentWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    await Student.findOneAndDelete({ _id: id, school: schoolId });
    const students = await Student.find({ school: schoolId });
    res
      .status(200)
      .json({
        success: true,
        message: "Student deleted successfully.",
        students,
      });
  } catch (error) {
    console.error("Error in deleteStudentWithId Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
