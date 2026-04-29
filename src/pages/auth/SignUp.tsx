import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegistrationErrors, RegistrationForm } from "../../types/SignUp";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, createUser } from "../../services/user.service";
import Form from "../../components/DynamicForm";
import { Alert, Snackbar } from "@mui/material";
import type { AppDispatch, RootState } from "../../store/store";

const formConfig = [
  { name: "name", label: "Name" },
  { name: "username", label: "Username" },
  { name: "email", label: "Email" },
  { name: "contact", label: "Contact Number", type: "tel" },
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
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.list);
  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  const validateContact = (contact: string) => /^[6-9]\d{9}$/.test(contact);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleSubmit = async () => {
    const newErrors: RegistrationErrors = {};
    const normalizedEmail = form.email.trim().toLowerCase();

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";

    if (!normalizedEmail) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(normalizedEmail)) {
      newErrors.email = "Invalid email format";
    } else if (users.some((user: any) => user.email.toLowerCase() === normalizedEmail)) {
      newErrors.email = "An account with this email already exists";
    }

    if (!form.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!validateContact(form.contact.trim())) {
      newErrors.contact = "Enter a valid 10-digit contact number";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToast({
        open: true,
        message: "Please fix the highlighted signup fields.",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(
        createUser({
          id: Date.now().toString(),
          name: form.name.trim(),
          username: form.username.trim(),
          email: normalizedEmail,
          contact: form.contact.trim(),
          password: form.password,
        })
      );
      setToast({
        open: true,
        message: "Account created successfully.",
        severity: "success",
      });
      setTimeout(() => navigate("/"), 700);
    } catch {
      setToast({
        open: true,
        message: "Unable to create account. Make sure JSON Server is running.",
        severity: "error",
      });
    }
  };

  return (
    <>
    <Form
      title="Create Account"
      fields={formConfig}
      values={form}
      errors={errors}
      onChange={(name, value) => {
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: undefined });
      }}
      onSubmit={() => handleSubmit()}
      submitText="Sign up"
      footerText="Don't have an account?"
      footerActionText="Login"
      onFooterAction={() => navigate("/")}
    />
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={() => setToast({ ...toast, open: false })}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={toast.severity}
        variant="filled"
        onClose={() => setToast({ ...toast, open: false })}
        sx={{ width: "100%" }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
    </>
  );
};

export default RegistrationPage;
