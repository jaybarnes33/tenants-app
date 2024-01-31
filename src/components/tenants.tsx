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
import { TableItem } from "@/app/(dashboard)/dashboard/properties/page";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { useModal } from "@/hooks/useModal";

export function Tenants() {
  const { session } = useSession();

  const fetchTenants = async () => {
    //@ts-ignore
    const {
      data: { tenants },
    } = await makeSecuredRequest(
      //@ts-ignore
      `${process.env.NEXT_PUBLIC_API}/api/estates/tenants/?estate=${session?.estate._id}`,
      "get"
    );

    return tenants;
  };

  const { data, isLoading } = useQuery(["tenants"], fetchTenants);

  return (
    <div className="space-y-8 py-4 px-4">
      <div className="flex items-start justify-between">
        <Heading
          title={`Number of Listings: (${data?.length || 0})`}
          description="Manage Listings"
        />
        {/* <Button
          onClick={() => {
            toggle();
            setContent(<AddListing />);
          }}
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button> */}
      </div>
      <Separator />

      {data?.length ? (
        <div>
          <Table>
            <TableCaption>All Tenants</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Property</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((listing: Record<string, any>) => (
                <TableRow key={listing?.tenant?._id}>
                  <TableCell className="w-2/6">
                    {listing?.tenant?.name}
                  </TableCell>
                  <TableCell className="w-2/6">
                    {listing?.tenant?.email}
                  </TableCell>
                  <TableCell className="w-2/6">{listing?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-red-500">No Tenants in {session?.estate.name}</div>
      )}
    </div>
  );
}
