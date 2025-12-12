"use client";

import { IconButton, CircularProgress, Snackbar, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { useTaskStore } from "@/app/lib/stores/taskStore";
import { handleApiError } from "@/app/lib/utils/api-client";

interface ToggleTaskCompleteProps {
  taskId: string;
  completed: boolean;
}

export default function ToggleTaskComplete({
  taskId,
  completed,
}: ToggleTaskCompleteProps) {
  const toggleTaskComplete = useTaskStore((state) => state.toggleTaskComplete);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await toggleTaskComplete(taskId, !completed);
      setToastMessage(
        completed ? "Task marked as incomplete" : "Task completed!"
      );
      setToastSeverity("success");
      setShowToast(true);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setToastMessage(errorMessage);
      setToastSeverity("error");
      setShowToast(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleToggleComplete}
        disabled={isUpdating}
        className={
          completed
            ? "text-emerald-600 hover:text-emerald-700"
            : "text-slate-400 hover:text-emerald-600"
        }
      >
        {isUpdating ? (
          <CircularProgress size={20} />
        ) : completed ? (
          <CheckCircleIcon fontSize="small" />
        ) : (
          <CheckCircleOutlineIcon fontSize="small" />
        )}
      </IconButton>

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
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
