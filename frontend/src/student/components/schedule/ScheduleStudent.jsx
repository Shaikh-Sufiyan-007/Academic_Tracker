import {
  Calendar,
  dateFnsLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { baseApi } from "../../../environment";
import Typography from "@mui/material/Typography";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ScheduleStudent = () => {


  const [selectedClass, setSelectedClass] = useState(null);

  const date = new Date();
  const myEventsList = [
    {
      id: 1,
      title: "Subject: History, Teacher: Hamid",
      start: new Date(date.setHours(11, 30)),
      end: new Date(date.setHours(14, 30)),
    },
    {
      id: 2,
      title: "Subject: English, Teacher: Hamid",
      start: new Date(new Date().setHours(15, 30)),
      end: new Date(new Date().setHours(18, 30)),
    },
  ];

  const [events, setEvents] = useState([])

  const fetchstudentDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`);
      setSelectedClass(response.data.student.branch)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchstudentDetails();
  }, []);

  useEffect(() => {
    if(selectedClass) {

      axios.get(`${baseApi}/schedule/fetch-with-class/${selectedClass._id}`).then(res => {
        console.log(res.data.data)
        const respData = res.data.data.map(x => {
          return ({
            id: x._id,
            title: `Sub: ${x.subject.subject_name} (${x.subject.subject_code}), Teacher: ${x.teacher.name}`,
            start: new Date(x.startTime),
            end: new Date(x.endTime)
          })
        })
        setEvents(respData)
      }).catch(e => {
        console.log("Error in fetching schedule", e)
      })
    }
  },[selectedClass])
  return (
    <div>
      <Typography variant="h5">Schedule of your class : {selectedClass?.class_text} ({selectedClass?.branch_code})</Typography>


      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={["week", "day", "agenda"]}
        step={30}
        timeslots={1}
        min={new Date(1970, 1, 1, 10, 0, 0)}
        startAccessor="start"
        endAccessor="end"
        max={new Date(1970, 1, 1, 17, 0, 0)}
        defaultDate={new Date()}
        showMultiDayTimes
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default ScheduleStudent;
