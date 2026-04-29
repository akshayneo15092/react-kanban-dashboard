import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginErrors, LoginForm } from "../../types/sign-in";
import { useSelector } from "react-redux";
import Form from "../../components/dynamic-form";
import { Alert, Snackbar } from "@mui/material";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    captchaChecked: false,
  });
  const users = useSelector((state: any) => state.user.list);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
  });
  const navigate = useNavigate();
  const [formConfig] = useState([
    { name: "email", label: "Email" },
    { name: "password", label: "Password", type: "password" },
  ]);

  const handleSubmit = () => {
    const newErrors: LoginErrors = {};
    const normalizedEmail = form.email.trim().toLowerCase();

    if (!normalizedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    if (!form.captchaChecked) {
      newErrors.captcha = "Please verify that you are not a robot";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({
        open: true,
        message: "Please fix the highlighted login fields.",
      });
      return;
    }

    const matchedUser = users.find(
      (u: any) => u.email.toLowerCase() === normalizedEmail && u.password === form.password
    );

    if (!matchedUser) {
      setErrors({ password: "Invalid email or password" });
      setToast({
        open: true,
        message: "Invalid email or password.",
      });
      return;
    }

    setErrors({});
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    navigate("/dashboard");
  };

  return (
    <>
    <Form
      title="Login"
      fields={formConfig}
      values={form}
      errors={errors}
      onChange={(name, value) => {
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: undefined });
      }}
      onSubmit={() => handleSubmit()}
      showCaptcha
      submitText="Log In"
      footerText="Don't have an account?"
      footerActionText="Sign Up"
      onFooterAction={() => navigate("/register")}
    />
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={() => setToast({ ...toast, open: false })}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity="error"
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

export default LoginPage;
