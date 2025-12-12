import { CircularProgress } from "@mui/material";

export default function Loading({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4 lg:p-8">
      <CircularProgress size={48} />
      <p className="text-lg text-slate-200">{message}</p>
    </div>
  );
}
