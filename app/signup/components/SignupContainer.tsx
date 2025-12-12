"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Snackbar,
} from "@mui/material";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { signUpSchema } from "@/app/lib/schemas/auth";
import z from "zod";

export default function SignupContainer() {
  const router = useRouter();
  const { handleSignUp, isLoading } = useAuth();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate with Zod
      const validatedData = signUpSchema.safeParse(formData);

      if (!validatedData.success) {
        const flattenedErrors = z.flattenError(validatedData.error);

        setErrors(flattenedErrors.fieldErrors as Record<string, string>);
        return;
      } else {
        await handleSignUp(formData.email, formData.password, formData.name);

        setSuccess(true);
        setToastMessage(
          "Sign up successful! Redirecting to email verification..."
        );
        setShowToast(true);
        router.push(`/verify-email/?email=${formData.email}`);

        setFormData({ name: "", email: "", password: "" });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      // Check if user already exists
      if (err.message === "USER_EXISTS") {
        setToastMessage("Account already exists. Please sign in instead.");
        setShowToast(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setToastMessage("Sign up failed. Please try again.");
        setShowToast(true);
      }
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

  return (
    <Card sx={{ maxWidth: 400, mt: 5, padding: 3 }}>
      <CardHeader title="Create an Account" />

      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange("password")}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Button onClick={() => router.push("/login")}>Sign In</Button>
          </Typography>
        </Box>
      </CardContent>

      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
