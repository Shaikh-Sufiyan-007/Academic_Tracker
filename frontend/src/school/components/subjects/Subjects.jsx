import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { subjectSchema } from '../../../yupSchema/subjectSchema'
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
import BookIcon from "@mui/icons-material/Book";
import StarIcon from "@mui/icons-material/Star";
import CategoryIcon from "@mui/icons-material/Category";
import Divider from '@mui/material/Divider'
import MessageSnackbar from '../../../basic-utility-components/snackbar/MessageSnackbar'


const Subjects = () => {
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleMessageClose = () => {
    setMessage('')
  }

  const [subjects, setSubjects] = useState([])
  const [edit, setEdit] = useState(false)
  const [editId, setEditId] = useState(null)

  const handleEdit = (id, subject_name, subject_code, credits, subject_type, branch_name, branch_code, year, semester) => {
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("subject_name", subject_name)
    Formik.setFieldValue("subject_code", subject_code)
    Formik.setFieldValue("subject_code", subject_code)
    Formik.setFieldValue("credits", credits)
    Formik.setFieldValue("subject_type", subject_type)
    Formik.setFieldValue("branch_name", branch_name)
    Formik.setFieldValue("branch_code", branch_code)
    Formik.setFieldValue("year", year)
    Formik.setFieldValue("semester", semester)
  }

  const cancelEdit = () => {
    setEdit(false)
    setEditId(null)
    Formik.setFieldValue("subject_name", "")
    Formik.setFieldValue("subject_code", "")
    Formik.setFieldValue("subject_code", "")
    Formik.setFieldValue("credits", "")
    Formik.setFieldValue("subject_type", "")
    Formik.setFieldValue("branch_name", "")
    Formik.setFieldValue("branch_code", "")
    Formik.setFieldValue("year", "")
    Formik.setFieldValue("semester", "")
  }

  const handleDelete = (id) => {
    axios.delete(`${baseApi}/subject/delete/${id}`).then(res => {
      setMessage(res.data.message)
      setMessageType('success')
    }).catch(e => {
      console.log("Error in deleting subject", e)
      setMessage("Error in deleting")
      setMessageType('error')
    })
  }

  const Formik = useFormik({
    initialValues: {subject_name: "", subject_code: "", credits: "", subject_type: "", branch_name: "", branch_code: "", year: "", semester: ""},
    validationSchema: subjectSchema,
    onSubmit: (values) => {

      if(edit) {
        axios.patch(`${baseApi}/subject/update/${editId}`, {...values}).then(res => {
        setMessage(res.data.message)
        setMessageType('success')
        cancelEdit()
      }).catch(e => {
        console.log("Error in editing subject", e)
        setMessage("Error in updating")
        setMessageType('error')
      })
      } else {
      axios.post(`${baseApi}/subject/create`, {...values}).then(res => {
        setMessage(res.data.message)
        setMessageType('success')

      }).catch(e => {
        console.log("Error in creating subject", e)
        setMessage("Error in saving")
        setMessageType('error')
      })
    }

      Formik.resetForm();
    }
  })

  const fetchAllsubjects = () => {
    axios.get(`${baseApi}/subject/all`).then(res => {
      setSubjects(res.data.data)
    }).catch(e => {
      console.log("Error in fetching subjects", e)
    })
  }

  useEffect(() => {
    fetchAllsubjects();
  },[message])

  return (
    <>
    {message &&
        <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
        <Typography variant='h3' sx={{textAlign: 'center', fontWeight: '600'}}>Subject</Typography>
    <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minWidth: "230px",
          margin: 'auto',
          background: '#fff'
        }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >

        {edit ? <Typography variant="h4" sx={{textAlign: "center", fontWeight: 600}}>Edit subject</Typography>
          : <Typography variant="h4" sx={{textAlign: "center", fontWeight: 600}}>Add New subject</Typography>
         }
       
        <TextField
          name="subject_name"
          label="Enter name of subject Exp: Mathematics"
          value={Formik.values.subject_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.subject_name && Formik.errors.subject_name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject_name}
          </p>
        )}

        <TextField
          name="subject_code"
          label="Enter code of subject Exp: MTH101"
          value={Formik.values.subject_code}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.subject_code && Formik.errors.subject_code && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject_code}
          </p>
        )}

        <TextField
          name="credits"
          label="Enter credits of subject."
          value={Formik.values.credits}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.credits && Formik.errors.credits && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.credits}
          </p>
        )}

        <TextField
          name="subject_type"
          label="Enter subject type Exp: Core, Elective or Lab"
          value={Formik.values.subject_type}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.subject_type && Formik.errors.subject_type && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject_type}
          </p>
        )}
        <TextField
          name="branch_name"
          label="Enter branch name, Exp: Btech, BCA, MCA"
          value={Formik.values.branch_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.branch_name && Formik.errors.branch_name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.branch_name}
          </p>
        )}

        <TextField
          name="branch_code"
          label="Enter branch section, Exp: A, B, C, D"
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
          name="year"
          label="Enter the year of study, Exp: 1st, 2nd, 3rd"
          value={Formik.values.year}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.year && Formik.errors.year && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.year}
          </p>
        )}

        <TextField
          name="semester"
          label="Enter the semister of study."
          value={Formik.values.semester}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.semester && Formik.errors.semester && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.semester}
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
  {subjects &&
    subjects.map((subj) => (
      <Card
        key={subj._id}
        sx={{
          width: 320,
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
          {/* Subject Name + Code */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <BookIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {subj.subject_name} ({subj.subject_code})
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Credits */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <StarIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="body1">Credits: <b>{subj.credits}</b></Typography>
          </Box>

          {/* Subject Type */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <CategoryIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="body1">Type: {subj.subject_type}</Typography>
          </Box>

          {/* Branch Name + Code */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <SchoolIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {subj.branch_name} ({subj.branch_code})
            </Typography>
          </Box>

          {/* Year + Semester */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CalendarTodayIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Year: {subj.year}, Semester: {subj.semester}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(subj._id, subj.subject_name, subj.subject_code, subj.credits, subj.subject_type, subj.branch_name, subj.branch_code, subj.year, subj.semester)}
                    sx={{ "&:hover": { bgcolor: "rgba(0, 195, 255, 0.34)" } }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(subj._id)}
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

export default Subjects

