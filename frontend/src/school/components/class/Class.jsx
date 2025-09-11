import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { classSchema } from '../../../yupSchema/classSchema'
import axios from 'axios'
import { baseApi } from '../../../environment'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton'
import MessageSnackbar from '../../../basic-utility-components/snackbar/MessageSnackbar'


const Class = () => {
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleMessageClose = () => {
    setMessage('')
  }

  const [classes, setClasses] = useState([])
  const [edit, setEdit] = useState(false)
  const [editId, setEditId] = useState(null)

  const handleEdit = (id, class_text, class_num, branch_code, branch_section) => {
    console.log(id)
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("class_text", class_text)
    Formik.setFieldValue("class_num", class_num)
    Formik.setFieldValue("class_num", class_num)
    Formik.setFieldValue("branch_code", branch_code)
    Formik.setFieldValue("branch_section", branch_section)
  }

  const cancelEdit = () => {
    setEdit(false)
    setEditId(null)
    Formik.setFieldValue("class_text", "")
    Formik.setFieldValue("class_num", "")
    Formik.setFieldValue("class_num", "")
    Formik.setFieldValue("branch_code", "")
    Formik.setFieldValue("branch_section", "")
  }

  const handleDelete = (id) => {
    console.log(id)
    axios.delete(`${baseApi}/class/delete/${id}`).then(res => {
      console.log(res)
      setMessage(res.data.message)
      setMessageType('success')
    }).catch(e => {
      console.log("Error in deleting class", e)
      setMessage("Error in deleting")
      setMessageType('error')
    })
  }

  const Formik = useFormik({
    initialValues: {class_text: "", class_num: "", branch_code: "", branch_section: ""},
    validationSchema: classSchema,
    onSubmit: (values) => {
      console.log(values)

      if(edit) {
        axios.patch(`${baseApi}/class/update/${editId}`, {...values}).then(res => {
        setMessage(res.data.message)
        setMessageType('success')
        cancelEdit()
      }).catch(e => {
        console.log("Error in editing class", e)
        setMessage("Error in updating")
        setMessageType('error')
      })
      } else {
      axios.post(`${baseApi}/class/create`, {...values}).then(res => {
        console.log(res)
        setMessage(res.data.message)
        setMessageType('success')

      }).catch(e => {
        console.log("Error in creating class", e)
        setMessage("Error in saving")
        setMessageType('error')
      })
    }

      Formik.resetForm();
    }
  })

  const fetchAllClasses = () => {
    axios.get(`${baseApi}/class/all`).then(res => {
      setClasses(res.data.data)
    }).catch(e => {
      console.log("Error in fetching classes", e)
    })
  }

  useEffect(() => {
    fetchAllClasses();
  },[message])

  return (
    <>
    {message &&
        <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
    <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          flexDirection: "column",
          width: "50vw",
          minWidth: "230px",
          margin: 'auto',
          background: '#fff'
        }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >

        {edit ? <Typography variant="h4" sx={{textAlign: "center", fontWeight: 600}}>Edit Class</Typography>
          : <Typography variant="h4" sx={{textAlign: "center", fontWeight: 600}}>Add New Class</Typography>
         }
       
        <TextField
          name="class_text"
          label="Enter branch name."
          value={Formik.values.class_text}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.class_text && Formik.errors.class_text && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.class_text}
          </p>
        )}

        <TextField
          name="class_num"
          label="Enter year of class."
          value={Formik.values.class_num}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.class_num && Formik.errors.class_num && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.class_num}
          </p>
        )}

        <TextField
          name="branch_code"
          label="Enter branch code."
          value={Formik.values.branch_code}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.branch_code && Formik.errors.branch_code && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.branch_code}
          </p>
        )}

        <TextField
          name="branch_section"
          label="Enter branch section."
          value={Formik.values.branch_section}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.branch_section && Formik.errors.branch_section && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.branch_section}
          </p>
        )}

        <Button sx={{width: '120px'}} type="submit" variant="contained">
          Submit
        </Button>
        {edit && <Button sx={{width: '120px'}} onClick={() => {cancelEdit()}} type="button" variant="outlined">
          Cancel
        </Button>}
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
        {classes &&
          classes.map((x) => (
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
                {/* Branch Name */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {x.class_text} ({x.branch_code})
                  </Typography>
                </Box>

                {/* Year */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarTodayIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="body1">Year: <b>{x.class_num}</b></Typography>
                </Box>

                {/* Section */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <GroupIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body1">Section: {x.branch_section}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(x._id, x.class_text, x.class_num, x.branch_code, x.branch_section)}
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
  )
}

export default Class