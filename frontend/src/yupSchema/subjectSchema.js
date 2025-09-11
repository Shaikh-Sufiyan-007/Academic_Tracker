import * as yup from "yup";

export const subjectSchema = yup.object({
    subject_name: yup.string().min(3, "Atleast 2 characters are required.").required("subject name is required field."),
    subject_code: yup.string().required("Subject Code is required field."),
    credits: yup.number().required("Credits is required field."),
    subject_type: yup.string().required("Subject Type is required field."),
    branch_name: yup.string().required("Branch Name is required field."),
    branch_code: yup.string().required("Branch Code is required field."),
    year: yup.string().required("Year is required field."),
    semester: yup.string().required("Semester is required field."),
})