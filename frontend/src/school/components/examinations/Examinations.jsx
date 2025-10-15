import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { examinationSchema } from "../../../yupSchema/examinationSchema";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Select, { selectClasses } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { baseApi } from "../../../environment";
import MessageSnackbar from "../../../basic-utility-components/snackbar/MessageSnackbar";
import { useEffect } from "react";

export default function Examinations() {
  const [examinations, setExaminations] = useState([]);

  const [subjects, setSubjects] = useState([])
  const [selectedClass, setSelectedClass] = useState("")

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
  
    const handleMessageClose = () => {
      setMessage("");
    };
  
    const handleNewMessage = (msg, type) => {
      setMessage(msg)
      setMessageType(type)
    }

      const dateFormate = (date) => {
    const jsDate = new Date(date);
    return jsDate.getDate() + "-" + (+jsDate.getMonth()+1) + "-" + jsDate.getFullYear()
  }

  const initialValues = {
    date: "",
    subject: "",
    examType: "",
  };

  
  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: examinationSchema,
    onSubmit: async(values) => {
      console.log(values);
      try {
        const response = await axios.post(`${baseApi}/examination/create`, {date: values.date, classId: selectedClass, subjectId: values.subject, examType: values.examType});
        setMessage(response.data.message);
        setMessageType("success");
        Formik.resetForm();
      } catch (error) {
        console.log(error);
        setMessage("Error in saving");
        setMessageType("error");
      }
    },
  });

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseApi}/subject/all`);
      setSubjects(response.data.data);
      console.log("subjects", response);
    } catch (error) {
      console.log(error);
    }
  };

  const [classes, setClasses] = useState([])

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`);
      setClasses(response.data.data);
      setSelectedClass(response.data.data[0]._id)
      console.log("classes", response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExamination = async() => {
    try {
      if(selectedClass) {
        const response = await axios.get(`${baseApi}/examination/class/${selectedClass}`)
        setExaminations(response.data.data)
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    fetchClasses()
  },[])

  useEffect(() => {
    fetchExamination();
    fetchSubjects();
  }, [message, selectedClass])


  return (
    <>
    {message && (
            <MessageSnackbar
              message={message}
              messageType={messageType}
              handleClose={handleMessageClose}
    
            />
          )}
      <Paper sx={{ marginBottom: "10px" }}>
        <Box>
                    <FormControl  sx={{ marginTop: "10px", minWidth: "210px" }}>
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
            onChange={(e) => {setSelectedClass(e.target.value)}}
            value={selectedClass}
            label="Subject"
            >
              <MenuItem value={""}>Select Subject</MenuItem>
              {classes.map(x => {
                return (
                  <MenuItem key={x._id} value={x._id}>{x.class_text} ({x.branch_code}) {x.class_num} year of section {x.branch_section}</MenuItem>
                )
              })}
              </Select>
          </FormControl>
        </Box>
      </Paper>
      <Paper>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={Formik.handleSubmit}
          sx={{ width: "24vw", minWidth: "310px", margin: "auto" }}
        >
          <Typography variant="h4">Add New Exam</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Basic date picker"
                value={Formik.values.date ? dayjs(Formik.values.date) : null}
                onChange={(newValue) => Formik.setFieldValue("date", newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          {Formik.touched.date && Formik.errors.date && (
            <p style={{ color: "red", textTransform: "capitalize" }}>
              {Formik.errors.date}
            </p>
          )}


          <FormControl fullWidth sx={{ marginTop: "10px" }}>
            <InputLabel id="demo-simple-select-label">Subejct</InputLabel>
            <Select
            name="subject"
            onChange={Formik.handleChange}
            onBlur={Formik.handleChange}
            value={Formik.values.subject}
            label="Subject"
            >
              <MenuItem value={""}>Select Subject</MenuItem>
              {subjects.map(subject => {
                return (
                  <MenuItem key={subject._id} value={subject._id}>{subject.subject_name}</MenuItem>
                )
              })}
              </Select>
          </FormControl>

          {Formik.touched.subject && Formik.errors.subject && (
            <p style={{ color: "red", textTransform: "capitalize" }}>
              {Formik.errors.subject}
            </p>
          )}

          <TextField
            fullWidth
            name="examType"
            value={Formik.values.examType}
            onChange={Formik.handleChange}
            onBlur={Formik.handleChange}
            sx={{ marginTop: "10px" }}
            label="Exam Type (Exp: Internal and External)"
            variant="filled"
          />
          {Formik.touched.examType && Formik.errors.examType && (
            <p style={{ color: "red", textTransform: "capitalize" }}>
              {Formik.errors.examType}
            </p>
          )}

          <Button sx={{ marginTop: "10px" }} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Exam Date</TableCell>
              <TableCell align="right">Subject</TableCell>
              <TableCell align="right">Exam Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.map((examination) => (
              <TableRow
                key={examination._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right" component="th" scope="row">
                  {dateFormate(examination.examDate)}
                </TableCell>
                <TableCell align="right">{examination.subject?examination.subject.subject_name:""}</TableCell>
                <TableCell align="right">{examination.examType}</TableCell>
                <TableCell align="right">"ACTION"</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
