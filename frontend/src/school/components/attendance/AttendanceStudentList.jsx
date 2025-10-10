import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useRef } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {
  studentEditSchema,
  studentSchema,
} from "../../../yupSchema/studentSchema";
import MessageSnackbar from "../../../basic-utility-components/snackbar/MessageSnackbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { baseApi } from "../../../environment";

import Grid from "@mui/material/Grid";

import { styled } from '@mui/material/styles';

import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function AttendanceStudentList() {
  const [file, setFile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
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
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
  };

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id);
    const filteredStudent = students.filter((student) => student._id === id);
    console.log(filteredStudent);
    Formik.setFieldValue("email", filteredStudent[0].email);
    Formik.setFieldValue("name", filteredStudent[0].name);
    Formik.setFieldValue("branch", filteredStudent[0].branch._id);
    Formik.setFieldValue("age", filteredStudent[0].age);
    Formik.setFieldValue("gender", filteredStudent[0].gender);
    Formik.setFieldValue("gaurdian_phone", filteredStudent[0].gaurdian_phone);
    Formik.setFieldValue("student_phone", filteredStudent[0].student_phone);
    Formik.setFieldValue("roll_num", filteredStudent[0].roll_num);
    Formik.setFieldValue("gaurdian", filteredStudent[0].gaurdian);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`http://localhost:5000/api/student/delete/${id}`)
        .then((res) => {
          console.log(res);
          setMessage(res.data.message);
          setMessageType("success");
        })
        .catch((e) => {
          setMessage("Error in deleting student.");
          setMessageType("error");
          console.log("Error in register: ", e);
        });
    }
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
    validationSchema: edit ? studentEditSchema : studentSchema,
    onSubmit: (values) => {
      console.log("Register submit values: ", values);

      if (edit) {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("branch", values.branch);
        formData.append("age", values.age);
        formData.append("gender", values.gender);
        formData.append("gaurdian_phone", values.gaurdian_phone);
        formData.append("student_phone", values.student_phone);
        formData.append("roll_num", values.roll_num);
        formData.append("gaurdian", values.gaurdian);

        if (file) {
          formData.append("image", file, file.name);
        }
        if (values.password) {
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

      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Student Attendance
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{xs: 6, md: 4}}>
          <Item>
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
          </Select>
        </FormControl>
      </Box>
          </Item>
        </Grid>
        <Grid size={{xs: 6, md: 8}}>
          <Item>      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Student Phone</TableCell>
              <TableCell align="right">Class</TableCell>
              <TableCell align="right">Percentage</TableCell>
              <TableCell align="right">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students &&
              students.map((student) => (
                <TableRow
                  key={student._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {student.name}
                  </TableCell>
                  <TableCell align="right">{student.gender}</TableCell>
                  <TableCell align="right">{student.student_phone}</TableCell>
                  <TableCell align="right">
                    {student.branch.class_text}-{student.branch.class_num} (
                    {student.branch.branch_code}) of section{" "}
                    {student.branch.branch_section}
                  </TableCell>
                  <TableCell align="right">percentage</TableCell>
                  <TableCell align="right">view</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer></Item>
        </Grid>

      </Grid>




    </Box>
  );
}
