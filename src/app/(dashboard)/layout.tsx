import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
import TopNavbar from "@/components/Navbar/TopNavbar";

export const metadata: Metadata = {
  title: "VUKU",
  description: "UNSCRIPTED LIVES, UNTOLD WORLDS.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="w-full overflow-y-auto bg-[#F8FAFD]">
        <TopNavbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

