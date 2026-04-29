import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  MenuItem,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import type { AuthFormProps } from "../types/form-interface";

const Form: React.FC<AuthFormProps> = ({
  title,
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  showCaptcha,
  submitText,
  footerText,
  footerActionText,
  onFooterAction,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: title === "Add Task" || title === "Edit Task" ? "auto" : "100vh",
        background:
          title === "Add Task" || title === "Edit Task"
            ? "transparent"
            : "linear-gradient(135deg, #eef6ff 0%, #f7fbf6 52%, #fff7ed 100%)",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          width: { xs: "100%", sm: 420 },
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: "0 20px 60px rgba(31, 41, 55, 0.10)",
        }}
      >
        <Typography variant="h5" fontWeight={800} textAlign="center">
          {title}
        </Typography>
        {(title === "Login" || title === "Create Account") && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mt={1}
            mb={3}
          >
            {title === "Login"
              ? "Access your workspace and keep tasks moving."
              : "Create your workspace profile to start organizing tasks."}
          </Typography>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          {fields.map((field) => {
            if (field.options) {
              return (
                <TextField
                  key={field.name}
                  select
                  label={field.label}
                  value={values[field.name]}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  size="small"
                  fullWidth
                >
                  {field.options.map((opt: string) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }
            return (
              <TextField
                key={field.name}
                label={field.label}
                type={field.type || "text"}
                value={values[field.name]}
                onChange={(e) => onChange(field.name, e.target.value)}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                size="small"
                slotProps={{
                  inputLabel:
                    field.type === "date" ? { shrink: true } : undefined,
                }}
                fullWidth
              />
            );
          })}

          {showCaptcha && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: 1,
                borderColor: "divider",
                borderRadius: 1.5,
                p: 1.5,
                bgcolor: values.captchaChecked ? "#f0fdf4" : "background.paper",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.captchaChecked}
                    onChange={(e) =>
                      onChange("captchaChecked", e.target.checked)
                    }
                  />
                }
                label="I'm not a robot"
              />
              <Box textAlign="center" sx={{ opacity: 0.6 }}>
                <VerifiedUserIcon fontSize="small" />
                <Typography variant="caption">reCAPTCHA</Typography>
              </Box>
            </Box>
          )}

          {errors.captcha && (
            <Typography variant="caption" color="error" mt={-1}>
              {errors.captcha}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onSubmit}
            sx={{ mt: 0.5, py: 1.2, fontWeight: 700, textTransform: "none" }}
          >
            {submitText}
          </Button>
        </Box>

        {(footerText || footerActionText) && (
        <Box textAlign="center" mt={2.5}>
          <Typography variant="body2" color="text.secondary">
            {footerText}{" "}
            <span
              style={{ color: "#1313ec", cursor: "pointer", fontWeight: 500 }}
              onClick={onFooterAction}
            >
              {footerActionText}
            </span>
          </Typography>
        </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Form;
