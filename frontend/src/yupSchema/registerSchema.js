import * as yup from "yup";

export const registerSchema = yup.object({
    school_name: yup.string().min(8, 'School name must contain 8 characters.').required("School name is required."),
    email: yup.string.email("It must be an Email").required("Email is required."),
    owner_name: yup.string().min(3, 'Owner name must contain 3 characters.').required("Owner name is required."),
    password: yup.string().min(8, 'Password must contain 8 characters.').required("Password is required."),
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required("Confirm password is required."),
})