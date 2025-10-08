import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { Formik, useFormik } from "formik";
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

const ScheduleEvent = ({ selectedClass }) => {
  const periods = [
    { id: 1, label: "Period 1", startTime: "10:00", endTime: "11:00" },
    { id: 2, label: "Period 2", startTime: "11:00", endTime: "12:00" },
    { id: 3, label: "Period 3", startTime: "13:00", endTime: "14:00" },
  ];

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

      console.log({
        ...values,
          selectedClass,
          startTime: new Date(
            date.setHours(startTime.split(":")[0], startTime.split(":")[1])
          ),
          endTime: new Date(
            date.setHours(endTime.split(":")[0], endTime.split(":")[1])
          ),
        }
      )
      axios
        .post(`${baseApi}/schedule/create`, {
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
          console.log("res", res);
        })
        .catch((e) => {
          console.log("Error in creating schedule", e);
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

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Add new period
      </Typography>
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
            value={Formik.values.branch}
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
              value={dayjs(Formik.values.date)}
              onChange={(newValue) => Formik.setFieldValue("date", newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </>
  );
};

export default ScheduleEvent;
