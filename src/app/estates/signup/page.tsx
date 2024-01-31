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

const Page = ({
  searchParams,
}: {
  searchParams: { estate: string; type: string };
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  async function adminSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (formData.confirm_password !== formData.password) {
        toast({
          variant: "default",
          title: "Password",
          description: "Passwords don't match",
        });
        return;
      }

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/users?estate=${searchParams.estate}&type=${searchParams.type}`,
        { ...formData }
      );
      toast({
        variant: "default",
        title: "Success",
        description: "Account linked to estate",
      });
      console.log(data);
      saveTokens(data);
      router.push(`/dashboard?estate=${searchParams.estate}`);
    } catch (error) {
      console.log(error);
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
            <CardTitle className="text-2xl">Admin Details</CardTitle>
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
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                onChange={handleChange}
                name="confirm_password"
                id="confirm_password"
                type="password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Create account
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Page;
