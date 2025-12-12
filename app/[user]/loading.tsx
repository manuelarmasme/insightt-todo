import { CircularProgress } from "@mui/material";

export default function Loading({ message }: { message: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-4 lg:p-8">
      <div className="rounded-3xl border border-slate-100 px-6 py-5 shadow-sm shadow-slate-200">
        <CircularProgress size={24} />
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}
