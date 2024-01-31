import useSession from "@/hooks/useUser";
import { makeSecuredRequest } from "@/lib/makeSecuredRequest";

import {
  Table,
  TableBody,
  TableCaption,
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
import AddListing from "@/components/AddListingForm";
import { TableItem } from "./TableItem";

export function RecentListings() {
  const { session } = useSession();

  const fetchEstates = async () => {
    //@ts-ignore
    const {
      data: { listings },
    } = await makeSecuredRequest(
      //@ts-ignore
      `${process.env.NEXT_PUBLIC_API}/api/listings?estate=${session?.estate._id}`,
      "get"
    );

    return listings;
  };

  const { data, isLoading } = useQuery(["listings"], fetchEstates);
  const { toggle, setContent } = useModal();

  return (
    <div className="space-y-8 py-4 px-4">
      <div className="flex items-start justify-between">
        <Heading
          title={`Number of Listings: (${data?.length || 0})`}
          description="Manage Listings"
        />
        <Button
          onClick={() => {
            toggle();
            setContent(<AddListing />);
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
            <TableCaption>All listings</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tenant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((listing: Record<string, string>) => (
                //@ts-ignore
                <TableItem listing={listing} key={listing.name} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-red-500">
          No listings in {session?.estate.name}
        </div>
      )}
    </div>
  );
}
