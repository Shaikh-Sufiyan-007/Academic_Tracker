import * as yup from "yup";

export const teacherSchema = yup.object({
    name: yup.string().min(3, 'Teacher name must contain 3 characters.').required("Teacher name is required."),
    email: yup.string().email("It must be an Email.").required("Email is required."),
    age: yup.string().required("Age is required field."),
    gender: yup.string().required("Gender is required field."),
    qualification: yup.string().min(4, 'must contain 4 characters.').required("Qualification is required field."),
    password: yup.string().min(8, 'Password must contain 8 characters.').required("Password is required."),
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required("Confirm password is required."),
})

export const teacherEditSchema = yup.object({
    name: yup.string().min(3, 'Teacher name must contain 3 characters.').required("Teacher name is required."),
    email: yup.string().email("It must be an Email.").required("Email is required."),
    age: yup.string().required("Age is required field."),
    gender: yup.string().required("Gender is required field."),
    qualification: yup.string().min(4, 'must contain 4 characters.').required("Qualification is required field."),
    password: yup.string().min(8, 'Password must contain 8 characters.'),
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
})