"use client";
import Authcontent from "@/components/Auth/Authcontent";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ModalProvider from "@/hooks/useModal";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Assistant GPT Dashboard",
// };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <ModalProvider>
        <SessionProvider>
          <Authcontent>
            <Header />
            <div className="flex h-screen overflow-y-scroll">
              <Sidebar />
              <main className="md:ml-72 w-full pt-16">{children}</main>
            </div>
          </Authcontent>
          {/* <Header /> */}
        </SessionProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
}
