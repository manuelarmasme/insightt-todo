"use client";

import { useAuth } from "@/app/lib/hooks/useAuth";
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/app/lib/stores/taskStore";

export default function LogoutButton() {
  const { isLoading, handleSignOut } = useAuth();
  const router = useRouter();
  const resetStore = useTaskStore((state) => state.resetStore);

  const handleLogout = async () => {
    await handleSignOut();
    resetStore();
    router.push("/");
  };

  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      disabled={isLoading}
      onClick={handleLogout}
      endIcon={<Logout />}
    >
      Logout
    </Button>
  );
}
