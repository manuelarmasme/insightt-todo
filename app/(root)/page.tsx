import LoginContainer from "./components/LoginContainer";
import { Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <LoginContainer />
    </Box>
  );
}
