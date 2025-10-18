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
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Select, { selectClasses } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { useEffect } from "react";
import { baseApi } from "../../environment";

export default function ExaminationsTeacher() {
  const [examinations, setExaminations] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");


  

  const dateFormate = (date) => {
    const jsDate = new Date(date);
    return (
      jsDate.getDate() +
      "-" +
      (+jsDate.getMonth() + 1) +
      "-" +
      jsDate.getFullYear()
    );
  };

  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`);
      setClasses(response.data.data);
      setSelectedClass(response.data.data[0]._id);
      console.log("classes", response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExamination = async () => {
    try {
      if (selectedClass) {
        const response = await axios.get(
          `${baseApi}/examination/class/${selectedClass}`
        );
        setExaminations(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchExamination();
  }, [selectedClass]);

  return (
    <>

      <Paper sx={{ marginBottom: "10px" }}>
        <Box>
          <FormControl sx={{ marginTop: "10px", minWidth: "210px" }}>
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
              onChange={(e) => {
                setSelectedClass(e.target.value);
              }}
              value={selectedClass}
              label="Subject"
            >
              <MenuItem value={""}>Select Subject</MenuItem>
              {classes.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.class_text} ({x.branch_code}) {x.class_num} year of
                    section {x.branch_section}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right"><b>Exam Date</b></TableCell>
              <TableCell align="right"><b>Subject</b></TableCell>
              <TableCell align="right"><b>Exam Type</b></TableCell>
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
                <TableCell align="right">
                  {examination.subject ? examination.subject.subject_name : ""}
                </TableCell>
                <TableCell align="right">{examination.examType}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
