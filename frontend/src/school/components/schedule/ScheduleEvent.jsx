import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { Form, Formik, useFormik } from "formik";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";

const ScheduleEvent = ({ selectedClass, handleEventClose, handleNewMessage, edit, selectedEventId }) => {
  const periods = [
    { id: 1, label: "Period 1 (10: 00 AM - 11: 00 AM)", startTime: "10:00", endTime: "11:00" },
    { id: 2, label: "Period 2 (11: 00 AM - 12: 00 AM)", startTime: "11:00", endTime: "12:00" },
    { id: 3, label: "Period 3 (12: 00 AM - 1: 00 PM)", startTime: "12:00", endTime: "13:00" },
    { id: 4, label: "Lunch Break (1: 00 AM - 2: 00 PM)", startTime: "13:00", endTime: "14:00" },
    { id: 5, label: "Period 4 (2: 00 PM - 3: 00 PM)", startTime: "14:00", endTime: "15:00" },
    { id: 6, label: "Period 5 (3: 00 PM - 4: 00 PM)", startTime: "15:00", endTime: "16:00" },
  ];

  const handleDelete = () => {
    if(confirm("Are you sure you want to delete this schedule?")) {
      axios.delete(`${baseApi}/schedule/delete/${selectedEventId}`).then(res => {
        handleNewMessage(res.data.message, "success")
        handleCancel()
      }).catch(e => {
        handleNewMessage("Error in deleting", "error")
      })
    }
  }
  const handleCancel = () => {
    Formik.resetForm();
    handleEventClose()
  }


  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const initialValues = {
    teacher: "",
    subject: "",
    period: "",
    date: dayjs(),
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: (values) => {
      let date = values.date.toDate();
      let startTime = values.period.split(",")[0];
      let endTime = values.period.split(",")[1];
      let BACKEND_URL = `${baseApi}/schedule/create`;

      if(edit) {
        BACKEND_URL = `${baseApi}/schedule/update/${selectedEventId}`
      } 

      axios
        .post(BACKEND_URL, {
          ...values,
          selectedClass,
          startTime: new Date(
            date.setHours(startTime.split(":")[0], startTime.split(":")[1])
          ),
          endTime: new Date(
            date.setHours(endTime.split(":")[0], endTime.split(":")[1])
          ),
        })
        .then((res) => {
          // setMessage(res.data.message);
          // setMessageType("success");
          handleNewMessage(res.data.message, "success");
          Formik.resetForm();
          handleEventClose();
        })
        .catch((e) => {
          console.log("Error in creating schedule", e);
          handleNewMessage("Error in creating new schedule", "error");
        });
    },
  });

  const fetchData = async () => {
    const teacherResponse = await axios.get(`${baseApi}/teacher/all`, {
      params: {},
    });
    const subjectResponse = await axios.get(`${baseApi}/subject/all`, {
      params: {},
    });
    setTeachers(teacherResponse.data.teachers);
    setSubjects(subjectResponse.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dateFormate = (date) => {
    const jsDate = date instanceof Date ? date : date.toDate();
    const dateHours = jsDate.getHours()
    const dateMinutes = jsDate.getMinutes()
    return `${dateHours}:${dateMinutes < 10 ? '0' : ''}${dateMinutes}`
  }

  useEffect(() => {
    if(selectedEventId) {
      axios.get(`${baseApi}/schedule/fetch/${selectedEventId}`, {}).then(res => {
        let start = dayjs(res.data.data.startTime);
        let end = dayjs(res.data.data.endTime);
        Formik.setFieldValue("teacher", res.data.data.teacher);
        Formik.setFieldValue("subject", res.data.data.subject);
        Formik.setFieldValue("date", start);
        const finalFormattedTime = dateFormate(start)+','+dateFormate(end)
        Formik.setFieldValue("period", `${finalFormattedTime}`);
      }).catch(e => {
        console.log("Error in editing schedule", e);
      })
    }
  },[selectedEventId])

  return (
    <>
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

        {edit ? <Typography variant="h4" sx={{ textAlign: "center" }}>
          Edit period
        </Typography> : 
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Add new period
        </Typography>
        }
        
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Teachers</InputLabel>
          <Select
            value={Formik.values.teacher}
            label="Teacher"
            name="teacher"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
          >
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
        {Formik.touched.teacher && Formik.errors.teacher && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.teacher}
          </p>
        )}

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Subjects</InputLabel>
          <Select
            value={Formik.values.subject}
            label="subject Name"
            name="subject"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
          >
            {subjects &&
              subjects.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.subject_name} ({x.subject_code})
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        {Formik.touched.subject && Formik.errors.subject && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject}
          </p>
        )}

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Periods</InputLabel>
          <Select
            value={Formik.values.period}
            label="Branch Name"
            name="period"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
          >
            {periods &&
              periods.map((x) => {
                return (
                  <MenuItem key={x._id} value={`${x.startTime},${x.endTime}`}>
                    {x.label}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        {Formik.touched.period && Formik.errors.period && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.period}
          </p>
        )}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Basic date picker"
              value={Formik.values.date ? dayjs(Formik.values.date) : null}
              onChange={(newValue) => Formik.setFieldValue("date", newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>

        <Button type="submit" variant="contained">
          Submit
        </Button>
        <Button type="button" variant="contained" onClick={handleDelete} color="error">
          Delete
        </Button>
        <Button type="button" onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default ScheduleEvent;
