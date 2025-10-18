import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { baseApi } from "../../environment";
const NoticeTeacher = () => {


  const [notices, setNotices] = useState([]);


  const fetchAllnotices = () => {
    axios
      .get(`${baseApi}/notice/teacher`)
      .then((res) => {
        setNotices(res.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching notices", e);
      });
  };

  useEffect(() => {
    fetchAllnotices();
  }, []);

  return (
    <>

      <Box
        component="div"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          p: 2,
          justifyContent: "flex-start",
        }}
      >
        {notices &&
          notices.map((x) => (
            <Card
              key={x._id}
              sx={{
                width: 280,
                borderRadius: 3,
                boxShadow: 4,
                transition: "transform 0.25s, box-shadow 0.25s",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.03)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Title: {x.title}
                    <br />
                    (For {x.audience})
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarTodayIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Message: <b>{x.message}</b>
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          ))}
      </Box>
    </>
  );
};

export default NoticeTeacher;
