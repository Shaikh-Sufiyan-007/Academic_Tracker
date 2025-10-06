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
import Teacher from "../models/teacher.model.js";

// AUTHENTICATION - Student, STUDENT AND TEACHER

export const registerTeacher = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const teacher = await Teacher.findOne({ email: fields.email });
      if (teacher) {
        return res
          .status(409)
          .json({ success: false, message: "teacher already exists." });
      }

      const photo = files.image;
      let filepath = photo.filepath;
      let originalFilename = photo.originalFilename.replace(" ", "_");
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      let newPath = path.join(
        __dirname,
        process.env.TEACHER_IMAGE_PATH,
        originalFilename
      );

      let photoData = fs.readFileSync(filepath);
      fs.writeFileSync(newPath, photoData);

      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hash(fields.password, salt);
      const newTeacher = new Teacher({
        school: req.user.schoolId,
        name: fields.name,
        email: fields.email,
        password: hashPassword,
        age: fields.age,
        gender: fields.gender,
        qualification: fields.qualification,
        teacher_image: originalFilename,
      });

      const savedTeacher = await newTeacher.save();
      res.status(201).json({
        success: true,
        data: savedTeacher,
        message: "teacher registered successfully.",
      });
    });
  } catch (error) {
    console.error("Error in registerTeacher Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (teacher) {
      const isAuth = bcrypt.compareSync(password, teacher.password);
      if (isAuth) {
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
          {
            id: teacher._id,
            schoolId: teacher.school,
            name: teacher.teacher_name,
            image_url: teacher.teacher_image,
            role: "TEACHER",
          },
          jwtSecret
        );

        res.header("Authorization", token);

        res.status(200).json({
          success: true,
          message: "teacher logged in successfully.",
          user: {
            id: teacher._id,
            schoolId: teacher.school,
            owner_name: teacher.owner_name,
            name: teacher.teacher_name,
            image_url: teacher.teacher_image,
            role: "TEACHER",
          },
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials." });
      }
    } else {
      res.status(404).json({ success: false, message: "teacher not found." });
    }
  } catch (error) {
    console.error("Error in loginTeacher Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeachersWithQuery = async (req, res) => {
  try {
    const filterQuery = {};
    const schoolId = req.user.schoolId;
    filterQuery["school"] = schoolId;

    if (req.query.search) {
      filterQuery["name"] = { $regex: req.query.search, $options: "i" };
    }

    const teachers = await Teacher.find(filterQuery)
      .select(["-password"]);
    res
      .status(200)
      .json({
        success: true,
        message: "teachers fetched successfully.",
        teachers,
      });
  } catch (error) {
    console.error("Error in getAllteachers Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherOwnData = async (req, res) => {
  try {
    const id = req.user.id;
    const schoolId = req.user.schoolId;
    const teacher = await Teacher.findById({ _id: id, school: schoolId })
      .select(["-password"]);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "teacher not found." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "teacher data fetched successfully.",
        teacher,
      });
  } catch (error) {
    console.error("Error in getTeacherOwnData Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;

    const teacher = await Teacher.findOne({ _id: id, school: schoolId }).select(
      ["-password"]
    );
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "teacher not found." });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "teacher data fetched successfully.",
        teacher,
      });
  } catch (error) {
    console.error("Error in getTeacherWithId Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const teacher = await Teacher.findOne({ _id: id, school: schoolId });
      if (files.image) {
        const photo = files.image;
        let filepath = photo.filepath;
        let originalFilename = photo.originalFilename.replace(" ", "_");

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        if (teacher.teacher_image) {
          let oldImagePath = path.join(
            __dirname,
            process.env.TEACHER_IMAGE_PATH,
            teacher.teacher_image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
              if (err) console.log("Error in deleting old image :", err);
            });
          }
        }

        let newPath = path.join(
          __dirname,
          process.env.TEACHER_IMAGE_PATH,
          originalFilename
        );
        let photoData = fs.readFileSync(filepath);
        fs.writeFileSync(newPath, photoData);

        Object.keys(fields).forEach((field) => {
          teacher[field] = fields[field];
        });
        teacher["teacher_image"] = originalFilename;

        if (fields.password) {
          const salt = await bcrypt.genSaltSync(10);
          const hashPassword = await bcrypt.hash(fields.password, salt);
          teacher["password"] = hashPassword;
        }

      } else {
        Object.keys(fields).forEach((field) => {
          teacher[field] = fields[field];
        });
      }

      await teacher.save();
      res
        .status(200)
        .json({
          success: true,
          message: "teacher updated successfully.",
          teacher,
        });
    });
  } catch (error) {
    console.error("Error in registerTeacher Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeacherWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    await Teacher.findOneAndDelete({ _id: id, school: schoolId });
    const teachers = await Teacher.find({ school: schoolId });
    res
      .status(200)
      .json({
        success: true,
        message: "teacher deleted successfully.",
        teachers,
      });
  } catch (error) {
    console.error("Error in deleteTeacherWithId Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
