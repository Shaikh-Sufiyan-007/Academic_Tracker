import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { classSchema } from '../../../yupSchema/classSchema'
import axios from 'axios'
import { baseApi } from '../../../environment'
import { useEffect, useState } from 'react'

const Class = () => {
  const [classes, setClasses] = useState([])
  const Formik = useFormik({
    initialValues: {class_text: "", class_num: ""},
    validationSchema: classSchema,
    onSubmit: (values) => {
      console.log(values)

      axios.post(`${baseApi}/class/create`, {...values}).then(res => {
        console.log(res)
      }).catch(e => {
        console.log("Error in creating class", e)
      })

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
  },[])

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
          margin: 'auto',
          background: '#fff'
        }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >

       <Typography variant="h4" sx={{textAlign: "center", fontWeight: 600}}>Add New Class</Typography>
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



        <Button type="submit" variant="contained">Submit</Button>
      </Box>

      <Box component={'div'} sx={{display: 'flex', flexWrap: 'wrap',}}>
        {classes && classes.map((item, index) => {
          return (
            <Box key={item._id}>
              <Typography>Class: {item.class_text} ({item.class_num})</Typography>
            </Box>
          )
        })}
      </Box>
      </>
  )
}

export default Class