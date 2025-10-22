import React, { useState } from "react";
import { useEffect } from "react";
import axios, { Axios } from "axios";
import { baseApi } from "../../environment";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import MessageSnackbar from "../../basic-utility-components/snackbar/MessageSnackbar";

const AttendanceTeacher = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMessageClose = () => {
    setMessage("");
  };

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [attendanceStatus, setAttendanceStatus] = useState({});
  const handleAttendance = (studentId, status) => {
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: status,
    }));
  };

  const singleStudentAttendance = async (studentId, status) => {
    try {
      const response = await axios.post(`${baseApi}/attendance/mark`, {
        studentId,
        date: new Date(),
        status,
        classId: selectedClass,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const submitAttendance = async () => {
    try {
      await Promise.all(
        students.map((student) =>
          singleStudentAttendance(student._id, attendanceStatus[student._id])
        )
      );
      setMessage("Attendance marked successfully");
      setMessageType("success");
    } catch (error) {
      console.log(error);
      setMessage("Error in marking attendance");
      setMessageType("error");
    }
  };

  const fetchAttendeeClass = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/attendee`);
      setClasses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAttendeeClass();
  }, []);

  const [attendanceChecked, setAttendanceChecked] = useState(false);
    const [students, setStudents] = useState([]);
  const checkAttendanceAndFetchStudent = async () => {
    try {
      if (selectedClass) {
        const responseStudent = await axios.get(`${baseApi}/student/all`, { params: { branch: selectedClass } })
        const responseCheck = await axios.get(`${baseApi}/attendance/check/${selectedClass}`);
        if(!responseCheck.data.attendanceTaken){
          setStudents(responseStudent.data.students);
          responseStudent.data.students.forEach((student) => {
            handleAttendance(student._id, "absent");
          });
        } else {
          setAttendanceChecked(true)
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAttendanceAndFetchStudent()
  }, [selectedClass, message]);
  return (
    <>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}
      {classes ? (
        <Paper sx={{ marginBottom: "10px" }}>
          <Box>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              You are the attendee of {classes.length} classes.
            </Alert>
            <FormControl sx={{ marginTop: "10px", minWidth: "210px" }}>
              <InputLabel>Class</InputLabel>
              <Select
                label="Class"
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setAttendanceChecked(false);
                }}
                value={selectedClass}
              >
                <MenuItem value={""}>Select Class</MenuItem>
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
      ) : (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
          You are not the attendee of any classes.
        </Alert>
      )}

      

      {(students.length > 0) ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">
                  <b>Name</b>
                </TableCell>
                <TableCell align="right">
                  <b>Roll Number</b>
                </TableCell>
                <TableCell align="right">
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right" component="th" scope="row">
                    {student.name}
                  </TableCell>
                  <TableCell align="right">{student.roll_num}</TableCell>
                  <TableCell align="right">
                    <FormControl sx={{ marginTop: "10px", minWidth: "210px" }}>
                      <InputLabel>Attendance</InputLabel>
                      <Select
                        onChange={(e) => {
                          handleAttendance(student._id, e.target.value);
                        }}
                        value={attendanceStatus[student._id]}
                        label="Attendance"
                      >
                        <MenuItem value={"present"}>Present</MenuItem>
                        <MenuItem value={"absent"}>Absent</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button sx={{display: 'flex', margin: 'auto', marginTop: '10px', marginBottom: '10px'}} variant="contained" onClick={submitAttendance}>
            Take Attendance
          </Button>
        </TableContainer>
      ) : (
        <>
          
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
              {attendanceChecked ? "Attendance already taken for this class." : "There is no student in this class."}
            </Alert>
        </>
      )}
    </>
  );
};

export default AttendanceTeacher;
