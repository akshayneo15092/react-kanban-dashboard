import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginErrors, LoginForm } from "../../types/sign-in";
import { useSelector } from "react-redux";
import Form from "../../components/dynamic-form";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    captchaChecked: false,
  });
  const users = useSelector((state: any) => state.user.list);
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate();
  const [formConfig] = useState([
    { name: "email", label: "Email" },
    { name: "password", label: "Password", type: "password" },
  ]);

  const handleSubmit = () => {
    // const newErrors: LoginErrors = {};

    // const matchedUser = users.find(
    //   (u: any) => u.email === form.email && u.password === form.password
    // );

    // if (!matchedUser) {
    //   setErrors({ password: "Invalid email or password" });
    //   return;
    // }
    // if (!form.captchaChecked) {
    //   newErrors.captcha = "Please verify that you are not a robot";
    // }
    // setErrors(newErrors);

    navigate("/dashboard");
  };

  return (
    <Form
      title="Login"
      fields={formConfig}
      values={form}
      errors={errors}
      onChange={(name, value) => setForm({ ...form, [name]: value })}
      onSubmit={() => handleSubmit()}
      showCaptcha
      submitText="Log In"
      footerText="Don't have an account?"
      footerActionText="Sign Up"
      onFooterAction={() => navigate("/register")}
    />
  );
};

export default LoginPage;
