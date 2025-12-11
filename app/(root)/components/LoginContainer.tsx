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
import { signInSchema } from "@/app/lib/schemas/auth";
import z from "zod";

export default function LoginContainer() {
  const router = useRouter();
  const { handleSignIn, isLoading, getUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate with Zod
      const validatedData = signInSchema.safeParse(formData);

      if (!validatedData.success) {
        const flattenedErrors = z.flattenError(validatedData.error);

        setErrors(flattenedErrors.fieldErrors as Record<string, string>);
        return;
      } else {
        await handleSignIn(formData.email, formData.password);

        // Get userId after successful login
        const user = await getUser();

        setSuccess(true);
        setToastMessage("Login successful! Redirecting...");
        setShowToast(true);

        if (user) {
          router.push(`/${user.userId}`);
        }
      }
    } catch (err) {
      setToastMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setShowToast(true);
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
      <CardHeader title="Sign In" />

      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
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
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>

          <Typography variant="body2" align="center">
            Don&apos;t have an account?{" "}
            <Button onClick={() => router.push("/signup")}>Sign Up</Button>
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
