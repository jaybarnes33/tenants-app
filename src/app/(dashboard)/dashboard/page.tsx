"use client";

import { Payments } from "@/components/Payments";
import { RecentListings } from "@/components/listings";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSession from "@/hooks/useUser";
import { makeSecuredRequest } from "@/lib/makeSecuredRequest";
import { useQuery } from "react-query";

export default function Page() {
  const { session } = useSession();

  const fetchStats = async () => {
    const { data } = await makeSecuredRequest(
      `${process.env.NEXT_PUBLIC_API}/api/users/stats`,
      "get"
    );
    return data;
  };
  const { data } = useQuery(["stats"], fetchStats);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi {session?.user.name.split(" ")[0]}, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {data &&
                Object.keys(data)?.map((item) => (
                  <Card key={item}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium capitalize">
                        {item.replaceAll("_", " ")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data[item]}</div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <div className="grid gap-4 grid-cols-1 ">
              {/* <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card> */}
              <Card className="col-span-4 md:col-span-3">
                <Payments />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
