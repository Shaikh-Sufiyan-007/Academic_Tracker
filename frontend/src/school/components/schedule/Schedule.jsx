import {
  Calendar,
  dateFnsLocalizer,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import ScheduleEvent from "./ScheduleEvent";
import Button from "@mui/material/Button";
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
import MessageSnackbar from "../../../basic-utility-components/snackbar/MessageSnackbar";

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

const Schedule = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleNewMessage = (msg, type) => {
    setMessage(msg)
    setMessageType(type)
  }

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [newPeriod, setNewPeriod] = useState(false);
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

  const [events, setEvents] = useState(myEventsList)


  const HandleEventClose = () => {
    setNewPeriod(false);
    setEdit(false)
    setSelectedEventId(null)
  };
  const [edit, setEdit] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const handleSelectEvent = (event) => {
    setEdit(true)
    setSelectedEventId(event.id)
  }

  useEffect(() => {
    axios
      .get(`${baseApi}/class/all`)
      .then((res) => {
        setClasses(res.data.data);
        setSelectedClass(res.data.data[0]._id);
      })
      .catch((e) => {
        console.log("Error in fetching classes", e);
      });
  }, []);

  useEffect(() => {
    if(selectedClass) {

      axios.get(`${baseApi}/schedule/fetch-with-class/${selectedClass}`).then(res => {
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
  },[selectedClass, message])
  return (
    <div>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}

        />
      )}
      <FormControl>
        <Select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
          }}
        >
          {classes &&
            classes.map((x) => {
              return (
                <MenuItem key={x._id} value={x._id}>
                  {x.class_text} ({x.branch_code} for section {x.branch_section}
                  )
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
      <Button onClick={() => setNewPeriod(true)}>Add new Period</Button>
      {(newPeriod || edit) && (
        <ScheduleEvent
          selectedClass={selectedClass}
          handleEventClose={HandleEventClose}
          handleNewMessage={handleNewMessage}
          edit={edit}
          selectedEventId={selectedEventId}
        />
      )}
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
        onSelectEvent={handleSelectEvent}
        max={new Date(1970, 1, 1, 17, 0, 0)}
        defaultDate={new Date()}
        showMultiDayTimes
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default Schedule;
