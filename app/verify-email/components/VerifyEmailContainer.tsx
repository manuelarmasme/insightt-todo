"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { verifyEmailSchema } from "@/app/lib/schemas/auth";
import z from "zod";

export default function VerifyEmailContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const { handleConfirmSignUp, isLoading } = useAuth();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    email: emailParam,
    code: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate with Zod
      const validatedData = verifyEmailSchema.safeParse(formData);

      if (!validatedData.success) {
        const flattenedErrors = z.flattenError(validatedData.error);

        setErrors(flattenedErrors.fieldErrors as Record<string, string>);
        return;
      } else {
        await handleConfirmSignUp(formData.email as string, formData.code);

        setSuccess(true);
        setToastMessage("Email verified successfully! Redirecting to login...");
        setShowToast(true);
        setFormData({ email: "", code: "" });
        router.push("/");
      }
    } catch (err) {
      setToastMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );

      setShowToast(true);
      setSuccess(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mt: 5, padding: 3 }}>
      <CardHeader title="Verify Your Email" />

      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the verification code sent to your email address.
          </Typography>

          <TextField
            label="Email"
            type="email"
            fullWidth
            disabled
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Verification Code"
            fullWidth
            margin="normal"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            error={!!errors.code}
            helperText={errors.code}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            aria-label="Verify email"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Verify Email"}
          </Button>

          <Typography variant="body2" align="center">
            Already verified?{" "}
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
