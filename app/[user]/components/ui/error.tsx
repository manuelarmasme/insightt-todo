import { Card, CardContent, Typography } from "@mui/material";

export default function Error({ message }: { message: string }) {
  return (
    <Card sx={{ margin: "1rem 0" }} className="flex items-center ">
      <CardContent>
        <Typography color="error" variant="body1">
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
}
