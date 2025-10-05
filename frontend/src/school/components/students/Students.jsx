import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Form, useFormik } from "formik";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import CardMedia from "@mui/material/CardMedia";
import { useRef } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { studentEditSchema, studentSchema } from "../../../yupSchema/studentSchema";
import MessageSnackbar from "../../../basic-utility-components/snackbar/MessageSnackbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { baseApi } from "../../../environment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  Email,
  Phone,
  Person,
  School,
  Badge,
  ContactPhone,
  Lock,
} from "@mui/icons-material";

import IconButton from "@mui/material/IconButton";

export default function Students() {
  const [file, setFile] = useState(null);
  const [edit, setEdit] = useState(false)
  const [editId, setEditId] = useState(null)
  const [classes, setClasses] = useState([]);
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

  const cancelEdit = () => {
    setEdit(false)
    setEditId(null)
    Formik.resetForm();
  }

  const handleEdit = (id) => {
    setEdit(true)
    setEditId(id)
    const filteredStudent = students.filter((student) => student._id === id)
    console.log(filteredStudent)
    Formik.setFieldValue('email', filteredStudent[0].email)
    Formik.setFieldValue('name', filteredStudent[0].name)
    Formik.setFieldValue('branch', filteredStudent[0].branch._id)
    Formik.setFieldValue('age', filteredStudent[0].age)
    Formik.setFieldValue('gender', filteredStudent[0].gender)
    Formik.setFieldValue('gaurdian_phone', filteredStudent[0].gaurdian_phone)
    Formik.setFieldValue('student_phone', filteredStudent[0].student_phone)
    Formik.setFieldValue('roll_num', filteredStudent[0].roll_num)
    Formik.setFieldValue('gaurdian', filteredStudent[0].gaurdian)
  }

  const handleDelete = (id) => {
    
  }

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
    validationSchema: edit ? studentEditSchema :studentSchema,
    onSubmit: (values) => {
      console.log("Register submit values: ", values);

      if(edit) {
        const formData = new FormData()
        
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("branch", values.branch);
        formData.append("age", values.age);
        formData.append("gender", values.gender);
        formData.append("gaurdian_phone", values.gaurdian_phone);
        formData.append("student_phone", values.student_phone);
        formData.append("roll_num", values.roll_num);
        formData.append("gaurdian", values.gaurdian);

        if(file) {
          formData.append("image", file, file.name);
        }
        if(values.password) {
          formData.append("password", values.password);
        }

        axios
        .patch(`http://localhost:5000/api/student/update/${editId}`, formData)
        .then((res) => {
          console.log(res);
          setMessage(res.data.message);
          setMessageType("success");
          Formik.resetForm();
          handleClearFile();
        })
        .catch((e) => {
          setMessage("Error in updating student.");
          setMessageType("error");
          console.log("Error in register: ", e);
        });

      } else {
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
    }
    },
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMessageClose = () => {
    setMessage("");
  };

  const fetchClasses = () => {
    axios
      .get(`${baseApi}/class/all`)
      .then((res) => {
        setClasses(res.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching classes", e);
      });
  };

  const [params, setParams] = useState({});
  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      branch: e.target.value || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const [students, setStudents] = useState([]);
  const fetchStudents = () => {
    axios
      .get(`${baseApi}/student/all`, { params })
      .then((res) => {
        setStudents(res.data.students);
        console.log(res);
      })
      .catch((e) => {
        console.log("Error in fetching classes", e);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [message, params]);

  return (
    <Box
      component={"div"}
      sx={{
        height: "80vh",
        paddingTop: "60px",
        paddingBottom: "60px",
        marginBottom: "500px",
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
        {edit ? <Typography variant="h4" sx={{ textAlign: "center" }}>Edit Student</Typography>
        :<Typography variant="h4" sx={{ textAlign: "center" }}>Add New Student</Typography>
        }

        <Typography>Add Student Picture</Typography>
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
            {classes &&
              classes.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.class_text} ({x.branch_code} for section{" "}
                    {x.branch_section})
                  </MenuItem>
                );
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

        <Button sx={{width: '120px'}} type="submit" variant="contained">
          Submit
        </Button>
        {edit && <Button color="error" sx={{width: '120px'}} onClick={() => {cancelEdit()}} type="button" variant="outlined">
                  Cancel
        </Button>}
      </Box>

      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <TextField
          label="Search student name"
          value={params.search ? params.search : ""}
          onChange={(e) => {
            handleSearch(e);
          }}
          // onBlur={Formik.handleBlur}
        />
        {Formik.touched.gaurdian_phone && Formik.errors.gaurdian_phone && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.gaurdian_phone}
          </p>
        )}

        <FormControl sx={{ width: "230px", marginLeft: "5px" }}>
          <InputLabel id="demo-simple-select-label">Branch Name</InputLabel>
          <Select
            label="Branch Name"
            value={params.branch ? params.branch : ""}
            onChange={(e) => {
              handleClass(e);
            }}
          >
            <MenuItem value="">Select Branch name</MenuItem>
            {classes &&
              classes.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.class_text} ({x.branch_code} for section{" "}
                    {x.branch_section})
                  </MenuItem>
                );
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
      </Box>

      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          flexWrap: "wrap",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        {students &&
          students.map((student) => {
            return (
              <Card
                sx={{
                  maxWidth: 400,
                  margin: "10px",
                  marginBottom: "100px",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)",
                  color: "white",
                  position: "relative",
                  overflow: "visible",
                }}
                key={student._id}
              >
                {/* Header Section */}
                <Box
                  sx={{
                    p: 3,
                    pb: 1,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar
                        src={`/images/uploaded/student/${student.student_image}`}
                        sx={{
                          width: 80,
                          height: 80,
                          border: "3px solid white",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        }}
                      >
                        {student.name.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {student.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={`Roll: ${student.roll_num}`}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          icon={<Badge sx={{ color: "white" }} />}
                        />
                        <Chip
                          label={student.gender}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                          }}
                          icon={<Person sx={{ color: "white" }} />}
                        />
                        <Chip
                          label={`Age: ${student.age}`}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <CardContent sx={{ p: 3, pt: 2 }}>
                  {/* Branch Information */}
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <School sx={{ color: "white" }} />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6" fontWeight="bold">
                          {student.branch.class_text} (
                          {student.branch.branch_code}) of section{" "}
                          {student.branch.branch_section}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.5, opacity: 0.9 }}
                        >
                          Roll Number: {student.roll_num}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider
                    sx={{ my: 2, backgroundColor: "rgba(255,255,255,0.3)" }}
                  />

                  {/* Contact Information */}
                  <Grid container spacing={2}>
                    {/* Email */}
                    <Grid item xs={12}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Email sx={{ color: "white" }} />
                        <Typography variant="body2" noWrap>
                          {student.email}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Student Phone Numbers */}

                    <Grid item xs={12} key={student._id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Phone sx={{ color: "white" }} />
                        <Typography variant="body2">
                          {student.student_phone}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider
                    sx={{ my: 2, backgroundColor: "rgba(255,255,255,0.3)" }}
                  />

                  {/* Guardian Information */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Guardian Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Person sx={{ color: "white" }} />
                          <Typography variant="body2">
                            {student.gaurdian}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <ContactPhone sx={{ color: "white" }} />
                          <Typography variant="body2">
                            {student.gaurdian_phone}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>

                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                    borderRadius: "0 0 0 100%",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 80,
                    height: 80,
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    borderRadius: "0 100% 0 0",
                  }}
                />

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <IconButton
                    onClick={() => {handleEdit(student._id)}}
                    sx={{ "&:hover": { bgcolor: "rgba(0, 195, 255, 0.34)" }, color: "rgba(198, 216, 96, 0.64)" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    sx={{ "&:hover": { bgcolor: "rgba(250, 13, 13, 0.24)" } }}
                    onClick={() => {handleDelete(student._id)}}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            );
          })}
      </Box>
    </Box>
  );
}
