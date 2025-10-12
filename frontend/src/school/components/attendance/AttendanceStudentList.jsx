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

import { styled } from "@mui/material/styles";

import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Attendee from "./Attendee";
import { Link } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function AttendanceStudentList() {

  const [classes, setClasses] = useState([]);


  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleMessage = (message, type) => {
    setMessageType(type)
    setMessage(message)
  }

  const fetchClasses = () => {
    axios
      .get(`${baseApi}/class/all`)
      .then((res) => {
        setClasses(res.data.data);
        console.log(res)
      })
      .catch((e) => {
        console.log("Error in fetching classes", e);
      });
  };

  const [params, setParams] = useState({});
  const [selectedClass, setSelectedClass] = useState(null)
  const handleClass = (e) => {
    setSelectedClass(e.target.value)
    setParams((prevParams) => ({
      ...prevParams,
      branch: e.target.value || undefined,
    }));
  };



  const [students, setStudents] = useState([]);
  const fetchStudents = () => {
    axios
      .get(`${baseApi}/student/all`, { params })
      .then((res) => {
        setStudents(res.data.students);
        fetchAttendanceForStudents(res.data.students);
      })
      .catch((e) => {
        console.log("Error in fetching classes", e);
      });
  };

  const [attendanceData, setAttendanceData] = useState({});

  const fetchAttendanceForStudents = async (studentList) => {
    const attendancePromises = studentList.map((student) =>
      fetchAttendanceForStudent(student._id)
    );
    const results = await Promise.all(attendancePromises);
    const updatedAttendanceData = {};
    results.forEach(({ studentId, attendancePercentage }) => {
      updatedAttendanceData[studentId] = attendancePercentage;
    });
    setAttendanceData(updatedAttendanceData);
  };

  const fetchAttendanceForStudent = async (studentId) => {
    try {
      const response = await axios.get(`${baseApi}/attendance/${studentId}`);
      const attendanceRecords = response.data.data;
      const totalClasses = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "present"
      ).length;
      const attendancePercentage =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      return { studentId, attendancePercentage };
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return { studentId, attendancePercentage: 0 };
    }
  };

  useEffect(() => {
    fetchClasses()
  }, [])

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
        <Grid size={{ xs: 6, md: 4 }}>
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

              <FormControl sx={{ width: "230px", marginLeft: "5px" }}>
                <InputLabel id="demo-simple-select-label">
                  Branch Name
                </InputLabel>
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

            <Box>
              {selectedClass && <Attendee classId={selectedClass} handleMessage={handleMessage} message={message} />}
            </Box>
            
          </Item>
        </Grid>
        <Grid size={{ xs: 6, md: 8 }}>
          <Item>
            {" "}
            <TableContainer component={Paper}>
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
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {student.name}
                        </TableCell>
                        <TableCell align="right">{student.gender}</TableCell>
                        <TableCell align="right">
                          {student.student_phone}
                        </TableCell>
                        <TableCell align="right">
                          {student.branch.class_text}-{student.branch.class_num}{" "}
                          ({student.branch.branch_code}) of section{" "}
                          {student.branch.branch_section}
                        </TableCell>
                        <TableCell align="right">
                          {attendanceData[student._id] !== undefined
                            ? `${attendanceData[student._id].toFixed(2)}%`
                            : "No Data"}
                        </TableCell>
                        <TableCell align="right"><Link to={`/school/attendance/${student._id}`}>Details</Link></TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
