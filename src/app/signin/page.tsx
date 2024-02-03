"use client";
import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { saveTokens } from "@/lib/utils";
import Link from "next/link";

const Page = ({
  searchParams,
}: {
  searchParams: { estate: string; type: string };
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  async function adminSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/auth`,
        { ...formData }
      );
      console.log(data);
      toast({
        variant: "default",
        title: "Success",
        description: "Login Successful",
      });
      saveTokens(data);
      router.push(`/dashboard`);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please check your URL",
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen grid place-items-center bg-cyan-600">
      <form onSubmit={adminSubmit}>
        <Card className="border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Provide an email and password to continue to your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                onChange={handleChange}
                id="email"
                type="email"
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                onChange={handleChange}
                name="password"
                id="password"
                type="password"
              />
            </div>
            <p className="small">
              Don&apos;t have an account? <Link href={"/signup"}>Signup</Link>
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Page;
