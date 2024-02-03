import useSession from "@/hooks/useUser";
import { makeSecuredRequest } from "@/lib/makeSecuredRequest";

import { usePaystackPayment } from "react-paystack";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { Heading } from "./heading";

import { Separator } from "./ui/separator";

import { Button, buttonVariants } from "./ui/button";
import { useModal } from "@/hooks/useModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios, { formToJSON } from "axios";
import { ChangeEvent, useState } from "react";
import { toast } from "./ui/use-toast";

const PaymentModal = ({ payment }: { payment: Record<string, any> }) => {
  const { toggle } = useModal();
  const [formData, setFormData] = useState({
    network: "",
    number: "",
  });

  const config = {
    reference: new Date().getTime().toString(),
    email: payment?.tenant?.email,
    currency: "GHS",
    phone: formData.number,
    amount: payment.bill.amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK || "",
  };
  const initializePayment = usePaystackPayment(config);
  const makePayment = async (ref: PaymentResponse) => {
    try {
      const { data } = await makeSecuredRequest(
        `${process.env.NEXT_PUBLIC_API}/api/payments/pay?payment=${payment._id}`,
        "post",
        ref
      );

      toast({
        variant: "default",
        title: "Success",
        description: "Payment made",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Couldn't make payment",
      });
    }
  };

  const mutation = useMutation({
    mutationFn: makePayment,
    onSuccess: () => {
      client.invalidateQueries(["bills"]);
    },
  });

  const onSuccess = (reference: PaymentResponse) => {
    // Implementation for whatever you want to do with reference and after success call.
    mutation.mutate(reference);
    toggle();
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  const client = useQueryClient();

  // Use useMutation to handle the POST request

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <form>
      <Card className="border w-[450px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl ">Pay Now</CardTitle>
          <CardDescription>
            Pay GHS{payment.bill.amount} as {payment.bill.name} to{" "}
            {payment.listing.estate.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              name="phone"
              id="phone"
              onChange={handleChange}
              type="tel"
              required
              placeholder="0245678910"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="network">Network</Label>

            <select
              name="network"
              id="network"
              className="p-2 border rounded "
              onChange={handleChange}
            >
              <option className="text-gray-100">Network</option>
              <option value="MTN">MTN</option>
              <option value="VODAFONE">Vodafone</option>
              <option value="AT">AirtelTigo</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              initializePayment({ onSuccess, onClose });
            }}
            disabled={mutation.isLoading}
            className="w-full"
            type="button"
          >
            Pay Now
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export function Payments() {
  const { session } = useSession();

  const fetchPayments = async () => {
    const {
      data: { payments },
    } = await makeSecuredRequest(
      //@ts-ignore
      `${process.env.NEXT_PUBLIC_API}/api/payments?tenant=${session?.user._id}`,
      "get"
    );

    return payments;
  };

  const { data, isLoading } = useQuery(["bills"], fetchPayments);
  const { toggle, setContent } = useModal();
  return (
    <div className="space-y-8 py-4 px-4">
      <div className="flex items-start justify-between">
        <Heading
          title={`Pending Bill Payments: (${data?.length || 0})`}
          description="Pay your bills"
        />
      </div>
      <Separator />

      {data?.length ? (
        <div>
          <Table>
            <TableCaption>Pending Payments</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((payment: Record<string, any>) => (
                <TableRow key={payment?._id}>
                  <TableCell>{payment?.createdAt.split("T")[0]}</TableCell>
                  <TableCell>{payment?.bill?.name}</TableCell>
                  <TableCell>{payment?.bill?.description}</TableCell>
                  <TableCell>{payment?.listing?.name}</TableCell>

                  <TableCell>GHS{payment?.bill?.amount}</TableCell>
                  <TableCell>{payment?.status}</TableCell>

                  {payment.status !== "paid" && (
                    <TableCell>
                      <Button
                        onClick={() => {
                          toggle();
                          setContent(<PaymentModal payment={payment} />);
                        }}
                      >
                        Pay now
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-red-500">No Payments for {session?.user.name}</div>
      )}
    </div>
  );
}
