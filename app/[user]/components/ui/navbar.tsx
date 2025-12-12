"use client";

import { useAuth } from "@/app/lib/hooks/useAuth";
import { Logout } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { isLoading, handleSignOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await handleSignOut();
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "rgba(71, 85, 105, 1)",
        borderRadius: "16px",
        marginBottom: "24px",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          My todo app
        </Typography>

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
      </Toolbar>
    </AppBar>
  );
}
