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
  inputLabelProps,
  onFooterAction,
}) => {
  return (
    <Box
      sx={{
       
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: { xs: "90%", sm: 400 } }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
          {title}
        </Typography>

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
              error={!field.date && !!errors[field.name]}
              helperText={field.date ? "" : errors[field.name]}
              slotProps={{
                inputLabel:
                  field.type === "date" ? { shrink: true } : undefined,
              }}
              fullWidth
            />
)})}

          {showCaptcha && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                p: 1.5,
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
            <Typography variant="caption" color="error">
              {errors.captcha}
            </Typography>
          )}

          <Button variant="contained" fullWidth onClick={onSubmit}>
            {submitText}
          </Button>
        </Box>

        <Box textAlign="center" mt={2}>
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
      </Paper>
    </Box>
  );
};

export default Form;
