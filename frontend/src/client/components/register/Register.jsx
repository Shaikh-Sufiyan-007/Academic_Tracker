import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Form, useFormik } from "formik";
import { registerSchema } from "../../../yupSchema/registerSchema";
import Button from "@mui/material/Button";
import { useState } from "react";
import CardMedia from "@mui/material/CardMedia";
import { useRef } from "react";
import Typography from "@mui/material/Typography";

export default function Register() {

  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const addImage = (e) => {
    const file = e.target.files[0]
    setImageUrl(URL.createObjectURL(file))
    setFile(file)
  }

  const fileInputRef = useRef(null)
  const handleClearFile = () => {
    if(fileInputRef.current){
      fileInputRef.current.value = '';
    }
    setFile(null)
    setImageUrl(null)
  }

  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log("Register submit values: ", values);
      Formik.resetForm();
      handleClearFile()
    },
  });

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
        display: "flex",
        flexDirection: "column",
        width: "60vw",
        minWidth: "230px",
        margin: 'auto',
      }}
      noValidate
      autoComplete="off"
      onSubmit={Formik.handleSubmit}
    >

      <Typography>Add College Picture</Typography>
      <TextField
      inputRef={fileInputRef}
      type="file"
      onChange={(e) => addImage(e)}
      />
      {imageUrl && <Box>
        
          <CardMedia component={'img'} height={'240px'} image={imageUrl} />
        </Box>}

      <TextField
        name="school_name"
        label="School Name"
        value={Formik.values.school_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />
      {Formik.touched.school_name && Formik.errors.school_name && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.school_name}
        </p>
      )}

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
        name="owner_name"
        label="Owner Name"
        value={Formik.values.owner_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />
      {Formik.touched.owner_name && Formik.errors.owner_name && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.owner_name}
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

      <TextField
      type="password"
        name="confirm_password"
        label="Confirm Password"
        value={Formik.values.confirm_password}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />
      {Formik.touched.confirm_password && Formik.errors.confirm_password && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.confirm_password}
        </p>
      )}

      <Button type="submit" variant="contained">Submit</Button>
    </Box>
  );
}
