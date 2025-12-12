import { Suspense } from "react";
import VerifyEmailContainer from "./components/VerifyEmailContainer";
import { Box, CircularProgress } from "@mui/material";

export default function VerifyEmailPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Suspense fallback={<CircularProgress />}>
        <VerifyEmailContainer />
      </Suspense>
    </Box>
  );
}
