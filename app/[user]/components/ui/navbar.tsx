"use client";

import { useAuth } from "@/app/lib/hooks/useAuth";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { isLoading, handleSignOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Implement logout functionality here

    await handleSignOut();
    router.push("/");
  };

  return (
    <header className="w-full flex-row items-center justify-between">
      <div>logo task</div>

      <Button
        variant="contained"
        color="primary"
        disabled={isLoading}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </header>
  );
}
