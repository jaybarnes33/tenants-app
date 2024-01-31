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

export function Bills() {
  const { session } = useSession();

  const fetchBills = async () => {
    //@ts-ignore
    const {
      data: { bills },
    } = await makeSecuredRequest(
      //@ts-ignore
      `${process.env.NEXT_PUBLIC_API}/api/bills?estate=${session?.estate._id}`,
      "get"
    );

    return bills;
  };

  const { data, isLoading } = useQuery(["bills"], fetchBills);
  const { toggle, setContent } = useModal();
  return (
    <div className="space-y-8 py-4 px-4">
      <div className="flex items-start justify-between">
        <Heading
          title={`Number of Bills: (${data?.length || 0})`}
          description="Manage Bills"
        />
        <Button
          onClick={() => {
            toggle();
            setContent(<AddBill />);
          }}
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />

      {data?.length ? (
        <div>
          <Table>
            <TableCaption>All Bills</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((bill: Record<string, any>) => (
                <TableRow key={bill?._id}>
                  <TableCell className="w-2/6">{bill?.name}</TableCell>
                  <TableCell className="w-2/6">{bill?.description}</TableCell>
                  <TableCell className="w-2/6">GHS{bill?.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-red-500">No Bills in {session?.estate.name}</div>
      )}
    </div>
  );
}
