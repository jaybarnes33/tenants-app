import useSession from "@/hooks/useUser";
import { makeSecuredRequest } from "@/lib/makeSecuredRequest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { useQuery } from "react-query";
import { Heading } from "./heading";

import { Separator } from "./ui/separator";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { useModal } from "@/hooks/useModal";
import AddBill from "./AddBillForm";

export function Payments() {
  const { session } = useSession();

  const fetchPayments = async () => {
    //@ts-ignore
    const {
      data: { payments },
    } = await makeSecuredRequest(
      //@ts-ignore
      `${process.env.NEXT_PUBLIC_API}/api/payments?estate=${session?.estate._id}`,
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
          title={`Number of Payments: (${data?.length || 0})`}
          description="Manage and Request Payments"
        />
        <Button
          onClick={() => {
            toggle();
            setContent(<AddBill />);
          }}
          className={buttonVariants({ variant: "default" })}
        >
          Request Payment
        </Button>
      </div>
      <Separator />

      {data?.length ? (
        <div>
          <Table>
            <TableCaption>All Payment Request</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Property</TableHead>

                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((payment: Record<string, any>) => (
                <TableRow key={payment?._id}>
                  <TableCell>{payment?.name}</TableCell>
                  <TableCell>{payment?.description}</TableCell>
                  <TableCell>GHS{payment?.amount}</TableCell>
                  <TableCell>{payment?.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-red-500">
          No Payments in {session?.estate.name}
        </div>
      )}
    </div>
  );
}
