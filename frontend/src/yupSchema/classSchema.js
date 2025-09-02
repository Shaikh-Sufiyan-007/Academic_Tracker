import * as yup from "yup";

export const classSchema = yup.object({
    class_text: yup.string().min(3, "Atleast 3 characters are required.").required("Class Text is required field."),
    class_num: yup.string().required("Class Number is required field."),
    branch_code: yup.string().required("Branch Code is required field."),
    branch_section: yup.string().required("Branch Section is required field."),
})