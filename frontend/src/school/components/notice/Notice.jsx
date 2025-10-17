import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import axios from "axios";
import { baseApi } from "../../../environment";
import { noticeSchema } from "../../../yupSchema/noticeSchema";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MessageSnackbar from "../../../basic-utility-components/snackbar/MessageSnackbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Notice = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMessageClose = () => {
    setMessage("");
  };

  const [notices, setNotices] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleEdit = (id, title, message, audience) => {
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("title", title);
    Formik.setFieldValue("message", message);
    Formik.setFieldValue("message", message);
    Formik.setFieldValue("audience", audience);
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
  };

  const handleDelete = (id) => {
    if(confirm("Are you sure you want to delete this notice?")) {
      axios
        .delete(`${baseApi}/notice/delete/${id}`)
        .then((res) => {
          setMessage(res.data.message);
          setMessageType("success");
        })
        .catch((e) => {
          console.log("Error in deleting notice", e);
          setMessage("Error in deleting");
          setMessageType("error");
        });
    }
  };

  const Formik = useFormik({
    initialValues: { title: "", message: "", audience: "" },
    validationSchema: noticeSchema,
    onSubmit: (values) => {

      if (edit) {
        axios
          .patch(`${baseApi}/notice/update/${editId}`, { ...values })
          .then((res) => {
            setMessage(res.data.message);
            setMessageType("success");
            cancelEdit();
          })
          .catch((e) => {
            console.log("Error in editing notice", e);
            setMessage("Error in updating");
            setMessageType("error");
          });
      } else {
        axios
          .post(`${baseApi}/notice/create`, { ...values })
          .then((res) => {
            setMessage(res.data.message);
            setMessageType("success");
          })
          .catch((e) => {
            console.log("Error in creating notice", e);
            setMessage("Error in saving");
            setMessageType("error");
          });
      }

      Formik.resetForm();
    },
  });

  const fetchAllnotices = () => {
    axios
      .get(`${baseApi}/notice/all`)
      .then((res) => {
        setNotices(res.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching notices", e);
      });
  };

  useEffect(() => {
    fetchAllnotices();
  }, [message]);

  return (
    <>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}
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
        {edit ? (
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            Edit notice
          </Typography>
        ) : (
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            Add New notice
          </Typography>
        )}

        <TextField
          name="title"
          label="Title"
          value={Formik.values.title}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.title && Formik.errors.title && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.title}
          </p>
        )}

        <TextField
          multiline
          rows={4}
          name="message"
          label="Message"
          value={Formik.values.message}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.message && Formik.errors.message && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.message}
          </p>
        )}

        <FormControl fullWidth sx={{ marginTop: "10px" }}>
          <InputLabel id="demo-simple-select-label">Audience</InputLabel>
          <Select
            name="audience"
            onChange={Formik.handleChange}
            onBlur={Formik.handleChange}
            value={Formik.values.audience}
            label="Audience"
          >
            <MenuItem value={""}>Select audience</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
            <MenuItem value={"student"}>Student</MenuItem>
          </Select>
        </FormControl>

        <Button sx={{ width: "120px" }} type="submit" variant="contained">
          Submit
        </Button>
        {edit && (
          <Button
            sx={{ width: "120px" }}
            onClick={() => {
              cancelEdit();
            }}
            color="error"
            type="button"
            variant="outlined"
          >
            Cancel
          </Button>
        )}
      </Box>

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

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleEdit(x._id, x.title, x.message, x.audience)
                    }
                    sx={{ "&:hover": { bgcolor: "rgba(0, 195, 255, 0.34)" } }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(x._id)}
                    sx={{ "&:hover": { bgcolor: "rgba(250, 13, 13, 0.24)" } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
      </Box>
    </>
  );
};

export default Notice;
