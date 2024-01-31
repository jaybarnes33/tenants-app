"use client";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/heading";
import { RecentListings } from "@/components/listings";

import React, { useEffect, useState } from "react";

const Page = () => {
  const breadcrumbItems = [{ title: "Listings", link: "/dashboard/listing" }];

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6 h-full ">
        <BreadCrumb items={breadcrumbItems} />

        <RecentListings />
      </div>
    </>
  );
};

export default Page;
