import NavBar from "./components/ui/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insightt list of tasks",
  description: "A simple todo app built with Next.js and Tailwind CSS",
};

export default function UserTaskLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col  w-full p-4 max-w-4xl h-full mx-auto bg-zinc-50 font-sans dark:bg-black">
      <NavBar />
      {children}
    </main>
  );
}
