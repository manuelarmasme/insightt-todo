import { AppBar, Toolbar, Typography } from "@mui/material";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
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

        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
}
