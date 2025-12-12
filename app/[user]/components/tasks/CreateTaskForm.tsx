"use client";

import { useState, FormEvent } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTaskStore } from "@/app/lib/stores/taskStore";
import { createTaskSchema } from "@/app/lib/schemas/task";
import { handleApiError } from "@/app/lib/utils/api-client";
import z from "zod";

export default function CreateTaskForm() {
  const addTask = useTaskStore((state) => state.addTask);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate with Zod
      const validatedData = createTaskSchema.safeParse(formData);

      if (!validatedData.success) {
        const flattenedErrors = z.flattenError(validatedData.error);
        setErrors(flattenedErrors.fieldErrors as Record<string, string>);
        setIsLoading(false);
        return;
      }

      // Create task and add to store (no refetch needed)
      await addTask(validatedData.data);

      // Reset form on success
      setFormData({ title: "", completed: false });
      setToastMessage("Task created successfully!");
      setToastSeverity("success");
      setShowToast(true);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setToastMessage(errorMessage);
      setToastSeverity("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "completed"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <Card className="rounded-lg">
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="flex flex-row w-full items-start justify-start gap-2"
          >
            <div className="flex-1">
              <TextField
                label="Task Title"
                fullWidth
                value={formData.title}
                onChange={handleChange("title")}
                placeholder="Enter a task "
                error={!!errors.title}
                disabled={isLoading}
                helperText={errors.title}
              />
            </div>

            <Button
              type="submit"
              variant="outlined"
              disabled={isLoading}
              className="h-14 min-w-14 mt-2"
            >
              {isLoading ? <CircularProgress size={24} /> : <AddIcon />}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
