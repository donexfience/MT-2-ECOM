import * as yup from "yup";
export const Loginschema = (isSignup: boolean) =>
  yup.object().shape({
    ...(isSignup && {
      username: yup.string().required("Username is required"),
    }),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
