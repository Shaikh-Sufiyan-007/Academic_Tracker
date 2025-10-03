import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Form, useFormik } from "formik";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import CardMedia from "@mui/material/CardMedia";
import { useRef } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { studentSchema } from "../../../yupSchema/studentSchema";
import MessageSnackbar from "../../../basic-utility-components/snackbar/MessageSnackbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { baseApi } from "../../../environment";

export default function Students() {
  const [file, setFile] = useState(null);
  const [classes, setClasses] = useState([])
  const [imageUrl, setImageUrl] = useState(null);
  const addImage = (e) => {
    const file = e.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  };

  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  };

  const initialValues = {
    name: "",
    email: "",
    branch: "",
    age: "",
    gender: "",
    gaurdian_phone: "",
    student_phone: "",
    roll_num: "",
    gaurdian: "",
    password: "",
    confirm_password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: studentSchema,
    onSubmit: (values) => {
      console.log("Register submit values: ", values);

      if (file) {
        const formData = new FormData();
        formData.append("image", file, file.name);
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("branch", values.branch);
        formData.append("age", values.age);
        formData.append("gender", values.gender);
        formData.append("gaurdian_phone", values.gaurdian_phone);
        formData.append("student_phone", values.student_phone);
        formData.append("roll_num", values.roll_num);
        formData.append("gaurdian", values.gaurdian);
        formData.append("password", values.password);

        axios
          .post(`http://localhost:5000/api/student/register`, formData)
          .then((res) => {
            console.log(res);
            setMessage(res.data.message);
            setMessageType("success");
            Formik.resetForm();
            handleClearFile();
          })
          .catch((e) => {
            setMessage("Error in saving student.");
            setMessageType("error");
            console.log("Error in register: ", e);
          });
      } else {
        setMessage("Please Add School/College Image.");
        setMessageType("error");
      }
    },
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMessageClose = () => {
    setMessage("");
  };

  const fetchClasses = () => {
    axios.get(`${baseApi}/class/all`).then(res => {
      setClasses(res.data.data)
    }).catch(e => {
      console.log("Error in fetching classes", e)
    })
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  return (
    <Box
      component={"div"}
      sx={{
        height: "80vh",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}

      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          flexDirection: "column",
          width: "50vw",
          minWidth: "230px",
          margin: "auto",
          background: "#fff",
        }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          Students
        </Typography>

        <Typography>Add College Picture</Typography>
        <TextField
          inputRef={fileInputRef}
          type="file"
          onChange={(e) => addImage(e)}
        />
        {imageUrl && (
          <Box>
            <CardMedia component={"img"} height={"240px"} image={imageUrl} />
          </Box>
        )}

        <TextField
          name="name"
          label="Student Name"
          value={Formik.values.name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.name && Formik.errors.name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.name}
          </p>
        )}

        <TextField
          name="email"
          label="Email"
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.email && Formik.errors.email && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.email}
          </p>
        )}


        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Branch Name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Formik.values.branch}
            label="Branch Name"
            name="branch"
            onChange={Formik.handleChange}
          >
            {classes && classes.map((x) => {
              return (
                <MenuItem id={x._id} value={x._id}>{x.class_text} ({x.branch_code} for section {x.branch_section})</MenuItem>
              )
            })}
            {/* <MenuItem value={"B.Tech(Bachelor of Technology / Engineering)"}>B.Tech(Bachelor of Technology / Engineering)</MenuItem>
            <MenuItem value={"B.Sc (Bachelor of Science)"}>B.Sc (Bachelor of Science)</MenuItem>
            <MenuItem value={"BBA (Bachelor of Business Administration)"}>BBA (Bachelor of Business Administration)</MenuItem>
            <MenuItem value={"B.Com (Bachelor of Commerce)"}>B.Com (Bachelor of Commerce)</MenuItem>
            <MenuItem value={"M.Tech (Master of Technology)"}>M.Tech (Master of Technology)</MenuItem>
            <MenuItem value={"MCA (Master of Computer Applications)"}>MCA (Master of Computer Applications)</MenuItem>
            <MenuItem value={"MBA (Master of Business Administration)"}>MBA (Master of Business Administration)</MenuItem>
            <MenuItem value={"M.Sc (Master of Science)"}>M.Sc (Master of Science)</MenuItem>
            <MenuItem value={"M.Com (Master of Commerce)"}>M.Com (Master of Commerce)</MenuItem>
            <MenuItem value={"MA (Master of Arts)"}>MA (Master of Arts)</MenuItem> */}
          </Select>
        </FormControl>
        {Formik.touched.branch && Formik.errors.branch && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.branch}
          </p>
        )}


        <TextField
          name="age"
          label="Age of student"
          value={Formik.values.age}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.age && Formik.errors.age && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.age}
          </p>
        )}

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Formik.values.gender}
            label="Gender"
            name="gender"
            onChange={Formik.handleChange}
          >
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
            <MenuItem value={"other"}>Other</MenuItem>
          </Select>
        </FormControl>
        {Formik.touched.gender && Formik.errors.gender && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.gender}
          </p>
        )}

        <TextField
          name="gaurdian_phone"
          label="gaurdian_phone of student"
          value={Formik.values.gaurdian_phone}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.gaurdian_phone && Formik.errors.gaurdian_phone && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.gaurdian_phone}
          </p>
        )}

        <TextField
          name="student_phone"
          label="student_phone of student"
          value={Formik.values.student_phone}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.student_phone && Formik.errors.student_phone && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.student_phone}
          </p>
        )}

        <TextField
          name="roll_num"
          label="roll_num of student"
          value={Formik.values.roll_num}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.roll_num && Formik.errors.roll_num && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.roll_num}
          </p>
        )}

        <TextField
          name="gaurdian"
          label="gaurdian of student"
          value={Formik.values.gaurdian}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.gaurdian && Formik.errors.gaurdian && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.gaurdian}
          </p>
        )}

        <TextField
          type="password"
          name="password"
          label="Password"
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.password && Formik.errors.password && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.password}
          </p>
        )}

        <TextField
          type="password"
          name="confirm_password"
          label="Confirm Password"
          value={Formik.values.confirm_password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.confirm_password && Formik.errors.confirm_password && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.confirm_password}
          </p>
        )}

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
