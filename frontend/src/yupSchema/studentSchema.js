import * as yup from "yup";

export const studentSchema = yup.object({
    name: yup.string().min(3, 'Student name must contain 3 characters.').required("Student name is required."),
    email: yup.string().email("It must be an Email.").required("Email is required."),
    branch: yup.string().required("Branch is required field."),
    branch_code: yup.string().required("Branch code is required field."),
    age: yup.string().required("Age is required field."),
    gender: yup.string().required("Gender is required field."),
    gaurdian_phone: yup.string().min(9, "Atleast 9 characters are required").max(11, "Atmost 11 characters are required").required("Gaurdian phone number is required field."),
    student_phone: yup.string().min(9, "Atleast 9 characters are required").max(11, "Atmost 11 characters are required").required("Student phone number is required field."),
    roll_num: yup.string().required("Roll number is required field."),
    gaurdian: yup.string().min(4, 'must contain 4 characters.').required("Gaurdian name is required field."),
    password: yup.string().min(8, 'Password must contain 8 characters.').required("Password is required."),
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required("Confirm password is required."),
})