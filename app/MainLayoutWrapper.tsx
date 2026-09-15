"use client";
import { usePathname } from "next/navigation";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  return (
    <main className={`flex-1 w-full flex flex-col ${!isHome ? "pt-28" : ""}`}>
      {children}
    </main>
  );
}
