import *as Yup from "yup";

export  const LoginSchemas = Yup.object({
    email: Yup.string().email().required('Please Enter your email'),
    password:Yup.string().required('Please enter your password')
})