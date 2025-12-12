"use client";

import {
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useTaskStore } from "@/app/lib/stores/taskStore";
import { handleApiError } from "@/app/lib/utils/api-client";
import { Task } from "@/app/lib/types/task";
import { updateTaskSchema } from "@/app/lib/schemas/task";
import z from "zod";

interface EditTaskDialogProps {
  task: Task;
}

export default function EditTaskDialog({ task }: EditTaskDialogProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleEditClick = () => {
    setTitle(task.title);
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (!isUpdating) {
      setOpenDialog(false);
      setTitle(task.title);
      setErrors({});
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    // Clear error when user starts typing
    if (errors.title) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  };

  const handleConfirmEdit = async () => {
    setErrors({});
    setIsUpdating(true);

    try {
      // Validate with Zod
      const validatedData = updateTaskSchema.safeParse({ title });

      if (!validatedData.success) {
        const flattenedErrors = z.flattenError(validatedData.error);
        setErrors(flattenedErrors.fieldErrors as Record<string, string>);
        setIsUpdating(false);
        return;
      }

      await updateTask(task._id, { title: validatedData.data.title! });
      setToastMessage("Task updated successfully!");
      setToastSeverity("success");
      setShowToast(true);
      setOpenDialog(false);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setToastMessage(errorMessage);
      setToastSeverity("error");
      setShowToast(true);
    } finally {
      setIsUpdating(false);
    }
  };

  // Disable submit button if title is the same as original
  const isSubmitDisabled = isUpdating || title.trim() === task.title;

  return (
    <>
      <IconButton
        size="small"
        onClick={handleEditClick}
        disabled={isUpdating}
        className="text-slate-400 hover:text-blue-600"
      >
        <EditIcon fontSize="small" />
      </IconButton>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="edit-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="edit-dialog-title">Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            type="text"
            fullWidth
            value={title}
            onChange={handleTitleChange}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isUpdating}
            placeholder="Enter task title"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEdit}
            color="primary"
            variant="contained"
            disabled={isSubmitDisabled}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

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
