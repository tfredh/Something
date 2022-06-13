import * as yup from "yup";

interface ContactMeSchema {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const contactMeSchema = yup.object().shape({
    name: yup.string(),
    email: yup.string().email("Invalid email"),
    subject: yup.string(),
    message: yup
        .string()
        .required("Message is required")
        .min(5, "I don't think this is a very important message"),
});

export interface PostSchema {
    title?: string;
}

export const postSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
});
