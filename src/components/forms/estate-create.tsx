"use client";

import * as React from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

interface EstateFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EstateForm({ className, ...props }: EstateFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    address: "",
    contact: "",
    city: "",
    admin: {
      name: "",
      email: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id: name, value } = e.target;
    console.log({ name, value });
    if (name.includes("_")) {
      let field = name.split("_")[1];
      setFormData((prev) => ({
        ...prev,
        admin: { ...prev.admin, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  //@ts-ignore
  async function handleForm(e) {
    e.preventDefault();
    if (step < 1) {
      setStep((step) => step + 1);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/estates`,
        {
          ...formData,
        }
      );
      toast({
        variant: "default",
        title: "Success",
        description:
          "Your estate has been created, please check the provided email for next steps",
      });
      setStep((step) => step + 1);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        variant: "destructive",
        description: (
          error as {
            response: {
              data: {
                message: string;
              };
            };
          }
        ).response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const [step, setStep] = React.useState(0);
  return (
    <div className={cn("grid gap-6 ", className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {step < 1
            ? "Let's get started"
            : step != 2
            ? "Almost there"
            : "Check Email"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step < 1
            ? "Fill the form below to get started"
            : step != 2
            ? "Please provide the name and email for your admin user to receive next steps"
            : "Thank you"}
        </p>
      </div>
      <form>
        {step === 0 && (
          <div className="grid gap-2 space-y-2">
            <div className="grid gap-1">
              <Label htmlFor="Name">Name</Label>
              <Input
                id="name"
                placeholder="Lakeside Estates"
                type="text"
                onChange={handleChange}
                autoCapitalize="none"
                autoComplete="name"
                required
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="contact">Phone Number</Label>
              <Input
                id="contact"
                placeholder="0545678910"
                type="text"
                onChange={handleChange}
                autoCapitalize="none"
                autoComplete="phone"
                required
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 space-x-2">
              <div className="grid gap-1">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  onChange={handleChange}
                  autoCapitalize="none"
                  autoComplete="address"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Accra"
                  type="text"
                  onChange={handleChange}
                  autoCapitalize="none"
                  autoComplete="city"
                  required
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description Here"
                autoCapitalize="none"
                required
                onChange={handleChange}
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-2 space-y-2">
            <div className="grid gap-1">
              <Label htmlFor="Name">Name</Label>
              <Input
                id="admin_name"
                placeholder="John Doe"
                type="text"
                onChange={handleChange}
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="admin_email">Email</Label>
              <Input
                id="admin_email"
                onChange={handleChange}
                placeholder="admin@estates.com"
                autoCapitalize="none"
                autoCorrect="off"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        )}
        {step == 2 && (
          <div>
            <h1>Please check the provided admin email for next steps</h1>
          </div>
        )}

        {step !== 2 && (
          <div className="my-2 flex justify-around">
            {step > 0 && step < 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((step) => step - 1)}
                disabled={isLoading}
              >
                Back
              </Button>
            )}

            {step < 1 && (
              <Button type="button" onClick={handleForm} disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Next
              </Button>
            )}

            {step >= 1 && (
              <Button type="submit" onClick={handleForm} disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
