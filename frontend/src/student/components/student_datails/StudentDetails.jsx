import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import CardMedia from "@mui/material/CardMedia";
import { baseApi } from "../../../environment";

export default function StudentDetails() {
  const [studentDetails, setstudentDetails] = useState(null);

  const fetchstudentDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`);
      setstudentDetails(response.data.student);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchstudentDetails();
  }, []);

  return (
    <>
      {studentDetails && (
        <>
          <CardMedia
            component="img"
            sx={{height: '310px', width: '310px', margin: 'auto', borderRadius: '50%'}}
            image={`./images/uploaded/student/${studentDetails.student_image}`}
            alt="Paella dish"
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <b>Name: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Email: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Roll No: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.roll_num}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Branch: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.branch.class_text} ({studentDetails.branch.branch_code})</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Section: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.branch.branch_section}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Year: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.branch.class_num} Year</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Age: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.age}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Gender: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Guardian Name: </b>
                  </TableCell>
                  <TableCell align="right">
                    {studentDetails.gaurdian}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Guardian Phone: </b>
                  </TableCell>
                  <TableCell align="right">
                    {studentDetails.gaurdian_phone}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Student Phone: </b>
                  </TableCell>
                  <TableCell align="right">
                    {studentDetails.student_phone}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
