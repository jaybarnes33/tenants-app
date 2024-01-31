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

const AddListing = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const { toggle } = useModal();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    tenant: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const { session } = useSession();

  const addListing = async () => {
    try {
      console.log(formData);
      const { data } = await makeSecuredRequest(
        //@ts-ignore
        `${process.env.NEXT_PUBLIC_API}/api/listings?estate=${session.estate._id}`,
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
    mutationFn: addListing,
    onSuccess: () => {
      client.invalidateQueries(["listings"]);
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
    if (name.includes("tenant")) {
      let field = name.split("-")[1];
      setFormData((prev) => ({
        ...prev,
        tenant: { ...prev.tenant, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <form onSubmit={adminSubmit} className="bg-white my-5">
        <Card className="min-w-[45vw] border-0 px-3 pt-5">
          <Tabs onValueChange={(value) => setStep(Number(value))}>
            <TabsList className="grid relative w-full grid-cols-2">
              <TabsTrigger value="0">Property</TabsTrigger>
              <TabsTrigger value="1">Tenant</TabsTrigger>
            </TabsList>
            {step === 0 && (
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Add Property</CardTitle>
                  <CardDescription>
                    Please provide details of your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Name</Label>
                    <Input
                      name="name"
                      onChange={handleChange}
                      id="name"
                      type="name"
                      placeholder=""
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      onChange={handleChange}
                      name="description"
                      id="description"
                    />
                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="description">Property Type</Label>
                    <TagsSelect onChange={} />
                  </div> */}
                </CardContent>
                <CardFooter className="grid grid-cols-2">
                  <Button
                    type="button"
                    disabled={!formData.name || !formData.description}
                    onClick={() => setStep(1)}
                    className="w-full"
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            )}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tenant Details</CardTitle>
                  <CardDescription>Add tenant details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="tenant-name">Name</Label>
                      <Input
                        name="tenant-name"
                        id="tenant-name"
                        onChange={handleChange}
                        type="text"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        name="tenant-phone"
                        onChange={handleChange}
                        id="phone"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone">Email</Label>
                    <Input
                      name="tenant-email"
                      onChange={handleChange}
                      id="email"
                      type="email"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={loading}>Create Listing</Button>
                </CardFooter>
              </Card>
            )}
          </Tabs>
        </Card>
      </form>
    </>
  );
};

export default AddListing;
