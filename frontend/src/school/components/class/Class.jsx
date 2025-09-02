import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { classSchema } from '../../../yupSchema/classSchema'
import axios from 'axios'

const Class = () => {
  const Formik = useFormik({
    initialValues: {class_text: "", class_num: ""},
    validationSchema: classSchema,
    onSubmit: (values) => {
      console.log(values)

    }
  })

  return (
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
          label="Class Text"
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
          label="Class Number"
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
  )
}

export default Class