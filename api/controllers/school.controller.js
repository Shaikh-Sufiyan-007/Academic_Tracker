import formidable from "formidable";
import School from "../models/school.model.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// AUTHENTICATION - SCHOOL, STUDENT AND TEACHER

export const registerSchool = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const photo = files.image[0];
      let filepath = photo.filepath;
      let originalFilename = photo.originalFilename.replace(" ", "_");
      let newPath = path.join(
        __dirname,
        process.env.SCHOOL_IMAGE_PATH,
        originalFilename
      );

      let photoData = fs.readFileSync(filepath);
      fs.writeFileSync(newPath, photoData);

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hash(fields.password[0], salt);
      const newSchool = new School({
        school_name: fields.school_name[0],
        email: fields.email[0],
        owner_name: fields.owner_name[0],
        password: hashPassword,
      });

      const savedSchool = await newSchool.save();
      res
        .status(201)
        .json({
          success: true,
          data: savedSchool,
          message: "School registered successfully.",
        });
    });
  } catch (error) {
    console.error("Error in registerSchool Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginSchool = async (req, res) => {
  try {
    const { email, password } = req.body;

    const school = await School.findOne({ email });
    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "School not found." });
    }

    const isAuth = bcrypt.compareSync(password, school.password);
    if (!isAuth) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({
        id: school._id,
        schoolId: school._id,
        owner_name: school.owner_name,
        school_name: school.school_name,
        image_url: school.school_image,
        role: "SCHOOL"}, jwtSecret);
    
    res.header("Authorization", token)

    res.status(200).json({
      success: true,
      message: "School logged in successfully.",
      user: {
        id: school._id,
        owner_name: school.owner_name,
        school_name: school.school_name,
        image_url: school.school_image,
        role: "SCHOOL"
      },
    });
  } catch (error) {
    console.error("Error in loginSchool Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().select(['-password', '-_id', '-email', '-owner_name','-createdAt']);
    res.status(200).json({ success: true, message: "Schools fetched successfully.", schools });
  } catch (error) {
    console.error("Error in getAllSchools Controller :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};