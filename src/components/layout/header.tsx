import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import useSession from "@/hooks/useUser";
import Modal from "../Modal/Modal";

export default function Header() {
  const { session } = useSession();
  return (
    <>
      <Modal />
      <div className="fixed top-0 left-0 right-0 border-b bg-white  backdrop-blur z-20">
        <nav className="h-14 flex items-center justify-between px-4">
          <div className="hidden md:block">
            <Link href={"/"} target="_blank" className="flex items-center">
              {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg> */}
              <span>{session?.user?.name.split(" ")[0]}&apos;s Dashboard</span>
            </Link>
          </div>
          <div className={cn("block sm:!hidden")}>
            <MobileSidebar />
          </div>

          <div className="flex items-center gap-2">
            <UserNav />
            {/* <ThemeToggle /> */}
          </div>
        </nav>
      </div>
    </>
  );
}
