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

import { toast } from "@/components/ui/use-toast";

import { Textarea } from "@/components/ui/textarea";
import useSession from "@/hooks/useUser";
import { makeSecuredRequest } from "@/lib/makeSecuredRequest";
import { useMutation, useQueryClient } from "react-query";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModal } from "@/hooks/useModal";

const AddBill = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const { toggle } = useModal();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
  });

  const { session } = useSession();

  const addBill = async () => {
    try {
      console.log(formData);
      const { data } = await makeSecuredRequest(
        //@ts-ignore
        `${process.env.NEXT_PUBLIC_API}/api/bills?estate=${session?.estate?._id}`,
        "post",
        { ...formData }
      );
      console.log(data);
      toast({
        variant: "default",
        title: "Success",
        description: "Listing added",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const client = useQueryClient();

  // Use useMutation to handle the POST request
  const mutation = useMutation({
    mutationFn: addBill,
    onSuccess: () => {
      client.invalidateQueries(["bills"]);
    },
  });
  async function adminSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      mutation.mutate();

      toggle();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <form onSubmit={adminSubmit} className="bg-white my-5">
        <Card className="min-w-[45vw] border-0 px-3 pt-5">
          <CardHeader>
            <CardTitle>Bill</CardTitle>
            <CardDescription>Create bill</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid  gap-2">
              <div className="space-y-1">
                <Label htmlFor="tenant-name">Bill Name</Label>
                <Input
                  name="name"
                  id="name"
                  onChange={handleChange}
                  type="text"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Bill Description</Label>
                <Textarea
                  name="description"
                  onChange={handleChange}
                  id="description"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Amount (GHS)</Label>
              <Input
                name="amount"
                required
                onChange={handleChange}
                id="amount"
                type="number"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={loading}>Add Bill</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default AddBill;
