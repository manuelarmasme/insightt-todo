"use client";

import { useState, FormEvent } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import { createTask } from "@/app/lib/utils/api-client";
import { createTaskSchema } from "@/app/lib/schemas/task";
import { handleApiError } from "@/app/lib/utils/api-client";
import z from "zod";

interface CreateTaskFormProps {
  onTaskCreated?: () => void;
}

export default function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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

      // Create task via API
      await createTask(validatedData.data);

      // Reset form on success
      setFormData({ title: "", description: "", completed: false });
      setToastMessage("Task created successfully!");
      setToastSeverity("success");
      setShowToast(true);

      // Collapse form after successful creation
      setTimeout(() => setIsExpanded(false), 500);

      // Callback to refresh task list
      if (onTaskCreated) {
        onTaskCreated();
      }
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 700,
          mx: "auto",
          mb: 4,
          borderRadius: 2,
          overflow: "hidden",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={toggleExpand}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon sx={{ color: "white", fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Create New Task
            </Typography>
          </Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            sx={{ color: "white" }}
          >
            {isExpanded ? <CloseIcon /> : <AddTaskIcon />}
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: 0,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Task Title"
                  fullWidth
                  margin="normal"
                  required
                  disabled={isLoading}
                  value={formData.title}
                  onChange={handleChange("title")}
                  error={!!errors.title}
                  helperText={errors.title || "Maximum 200 characters"}
                  placeholder="Enter a clear and concise task title..."
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                  }}
                />

                <TextField
                  label="Description (Optional)"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  disabled={isLoading}
                  value={formData.description}
                  onChange={handleChange("description")}
                  error={!!errors.description}
                  helperText={errors.description || "Maximum 500 characters"}
                  placeholder="Add more details about your task..."
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.completed}
                      onChange={handleChange("completed")}
                      disabled={isLoading}
                      sx={{
                        color: "#667eea",
                        "&.Mui-checked": {
                          color: "#667eea",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Mark as completed
                    </Typography>
                  }
                  sx={{ mt: 1, mb: 2 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )
                    }
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: 16,
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5568d3 0%, #614a8f 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isLoading ? "Creating..." : "Create Task"}
                  </Button>

                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    onClick={() => {
                      setFormData({
                        title: "",
                        description: "",
                        completed: false,
                      });
                      setErrors({});
                    }}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: 16,
                      fontWeight: 600,
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        borderColor: "#5568d3",
                        backgroundColor: "rgba(102, 126, 234, 0.04)",
                      },
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Collapse>
      </Paper>

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
