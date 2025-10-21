import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { useEffect } from "react";
import { baseApi } from "../../../environment";
import Typography from "@mui/material/Typography";

export default function ExaminationsStudent() {
  const [examinations, setExaminations] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);


  

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

  const [classId, setClassId] = useState("")

  const fetchExamination = async () => {
    try {
      if (selectedClass) {
        const response = await axios.get(
          `${baseApi}/examination/class/${classId}`
        );
        console.log(response)
        setExaminations(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchstudentDetails = async () => {
      try {
        const response = await axios.get(`${baseApi}/student/fetch-single`);
        setSelectedClass(response.data.student.branch);
        setClassId(response.data.student.branch._id)
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      fetchstudentDetails()
    },[])

  useEffect(() => {
    fetchExamination();
  }, [selectedClass]);

  return (
    <>
      <Typography variant="h5">Schedule of your class : {selectedClass?.class_text} ({selectedClass?.branch_code})</Typography>

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
