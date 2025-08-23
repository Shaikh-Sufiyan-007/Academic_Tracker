import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Form, useFormik } from "formik";
import Button from "@mui/material/Button";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import MessageSnackbar from "../../../basic-utility-components/snackbar/MessageSnackbar";
import { loginSchema } from "../../../yupSchema/loginSchema";

export default function Login() {

  const initialValues = {
    email: "",
    password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      axios.post(`http://localhost:5000/api/school/login`, values).then(res => {
        const token = res.headers.get("Authorization")
        if(token) {
          localStorage.setItem('token', token)
        }
        const user = res.data.user;
        if(user) {
          localStorage.setItem('user', JSON.stringify(user))
        }
        setMessage(res.data.message)
        setMessageType('success')
        Formik.resetForm();
      }).catch(e => {
        setMessage(e.response.data.message)
        setMessageType("error")
        console.log("Error in register: ", e)
      })

    },
  });

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleMessageClose = () => {
    setMessage('')
  }

  return (
    <Box component={'div'} sx={{
      background: "url(https://images.quiz-maker.com/images/bb8c3b97-ef1f-43b8-4c31-f29b3c35c600/public)",
      height: "80vh",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      paddingTop: "60px",
      paddingBottom: "60px"
      }}>
      {message &&
        <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
        <Typography variant="h2" sx={{textAlign: "center", color: "white"}}>Login</Typography>

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

       
        <TextField
          name="email"
          label="Email"
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.email && Formik.errors.email && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.email}
          </p>
        )}

        <TextField
          type="password"
          name="password"
          label="Password"
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.password && Formik.errors.password && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.password}
          </p>
        )}



        <Button type="submit" variant="contained">Submit</Button>
      </Box>
    </Box>
  );
}
