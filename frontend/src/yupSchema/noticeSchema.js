import * as yup from "yup";

export const noticeSchema = yup.object({
    title: yup.string().min(3, "Atleast 3 characters are required.").required("Title is required field."),
    message: yup.string().min(8, "Atleast 8 characters are required").required("Message is required field."),
    audience: yup.string().required("Audience is required field."),
})