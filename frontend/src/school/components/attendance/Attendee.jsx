import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Attendee = ({ classId, handleMessage, message }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("")

  const handleSubmit = async() => {
    try {
      if(selectedTeacher){
        const response = await axios.patch(`${baseApi}/class/update/${classId}`, {attendee: selectedTeacher})
        handleMessage("Attendee updated successfully", "success")
      }else {
        alert("Please select a teacher first.")
      }
    } catch (error) {
      console.log(error)
      handleMessage("Error in updating attendee", "error")
    }
  }

  const fetchTeachers = () => {
    axios
      .get(`${baseApi}/teacher/all`, { params: {} })
      .then((res) => {
        setTeachers(res.data.teachers);
      })
      .catch((e) => {
        console.log("Error in fetching classes", e);
      });
  };


  
    const [attendee, setAttendee] = useState(null)
    const fetchClassDetails = async () => {
      if(classId){
        try {
          const response = await axios.get(`${baseApi}/class/single/${classId}`)
          setAttendee(response.data.data.attendee ? response.data.data.attendee : null)
        } catch (error) {
          console.log(error)
        }
      }
    }

  useEffect(() => {
    fetchClassDetails()
    fetchTeachers();
  }, [classId, message]);
  return (
    <>
      <Box>
        {attendee && <Box sx={{display: 'flex', justifyContent: 'center'}} component={'div'}>
          <Typography 
            variant="h6" 
            sx={{
                fontWeight: '500',
                color: '#475569',
                marginRight: '12px',
                marginTop: '20px',
                marginBottom: '10px'
            }}
        >
            Attendee Teacher :
        </Typography>
        <Typography 
            variant="h6" 
            sx={{
                fontWeight: '700',
                background: 'linear-gradient(45deg, #1e293b, #475569)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                marginTop: '20px',
                marginBottom: '10px'
            }}
        >
            {attendee.name}
        </Typography>
        </Box>}
        
        <FormControl sx={{ width: "230px", marginLeft: "5px",marginTop: "20px" }}>
          <InputLabel id="demo-simple-select-label">Teacher Name</InputLabel>
          <Select
            label="Select Teachers"
            value={selectedTeacher}
            onChange={(e) => {
              setSelectedTeacher(e.target.value);
            }}
          >
            <MenuItem value="">Select teacher name</MenuItem>
            {teachers &&
              teachers.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <Button onClick={handleSubmit} sx={{
          color: "white",
          backgroundColor: "#1976d2",
          borderRadius: "6px",
          marginTop: '25px',
          marginLeft: '20px',
          padding: "8px 16px",
          fontWeight: "500",
          textTransform: "none",
          fontSize: "14px",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}>{attendee ? "Change Attendee" : "Select Attendee"}</Button>
      </Box>
    </>
  );
};

export default Attendee;
