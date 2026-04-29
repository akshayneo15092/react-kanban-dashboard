import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegistrationErrors, RegistrationForm } from "../../types/sign-up";
import { useDispatch } from "react-redux";
import { addUser } from "../../slices/user-slice";
import Form from "../../components/dynamic-form";

const formConfig = [
  { name: "name", label: "Name" },
  { name: "username", label: "Username" },
  { name: "email", label: "Email" },
  { name: "contact", label: "Contact Number" },
  { name: "password", label: "Password", type: "password" },
];
const RegistrationPage: React.FC = () => {
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    username: "",
    email: "",
    contact: "",
    password: "",
    date: "",
    terms: false,
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = () => {
    const newErrors: RegistrationErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.username) newErrors.username = "Username is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.terms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);

    dispatch(
      addUser({
        name: form.name,
        username: form.username,
        email: form.email,
        contact: form.contact,
        password: form.password,
        deadline: form.date,
      })
      
    );
    navigate("/");
  };

  return (
    <Form
      title="Create Account"
      fields={formConfig}
      values={form}
      errors={errors}
      onChange={(name, value) => setForm({ ...form, [name]: value })}
      onSubmit={() => handleSubmit()}
      submitText="Sign up"
      footerText="Don't have an account?"
      footerActionText="Login"
      onFooterAction={() => navigate("/")}
    />
  );
};

export default RegistrationPage;
