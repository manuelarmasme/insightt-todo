"use client";

import {
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useTaskStore } from "@/app/lib/stores/taskStore";
import { handleApiError } from "@/app/lib/utils/api-client";

export default function DeleteTaskDialog({ taskId }: { taskId: string }) {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleDeleteClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (!isDeleting) {
      setOpenDialog(false);
      setSelectedTaskId(null);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTaskId) return;

    setIsDeleting(true);
    try {
      await deleteTask(selectedTaskId);
      setToastMessage("Task deleted successfully!");
      setToastSeverity("success");
      setShowToast(true);
      setOpenDialog(false);
      setSelectedTaskId(null);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setToastMessage(errorMessage);
      setToastSeverity("error");
      setShowToast(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDeleteClick(taskId)}
        disabled={isDeleting}
        className="text-slate-400 hover:text-red-600"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        disableRestoreFocus
      >
        <DialogTitle id="delete-dialog-title">Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? <CircularProgress size={24} /> : "Delete"}
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
