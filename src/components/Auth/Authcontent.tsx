"use client";
import useSession from "@/hooks/useUser";
import { useRouter } from "next/navigation";

import React, { ReactNode, useEffect } from "react";

const Authcontent = ({ children }: { children: ReactNode }) => {
  const { session, isLoading } = useSession();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default Authcontent;
