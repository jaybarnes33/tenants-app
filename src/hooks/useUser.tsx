"use client";
import { useState, useEffect } from "react";
import { makeSecuredRequest } from "@/lib/makeSecuredRequest";
import { useQuery } from "react-query";

const useSession = () => {
  const fetchSession = async () => {
    const { data } = await makeSecuredRequest(
      "http://localhost:8080/api/auth",
      "get"
    );

    return data;
  };

  const { data, isLoading } = useQuery("session", fetchSession);

  return { session: data?.session, isLoading };
};

export default useSession;
