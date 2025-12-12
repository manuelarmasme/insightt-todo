"use client";

import { useAuth } from "@/app/lib/hooks/useAuth";
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { isLoading, handleSignOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await handleSignOut();
    router.push("/");
  };

  return (
    <header className="w-full flex px-4 flex-row items-center justify-between bg-gray-600 py-3 rounded-2xl mb-6">
      <div className="text-dark font-bold">My todo app</div>

      <Button
        size="small"
        variant="contained"
        color="primary"
        disabled={isLoading}
        onClick={handleLogout}
      >
        <span className="flex items-center gap-2">
          Logout
          <Logout />
        </span>
      </Button>
    </header>
  );
}
