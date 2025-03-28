
import React from "react";
import LeadsTable from "./components/LeadsTable";
import { PageTitle } from "@/components/PageTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Leads",
  description: "All Leads",
};

const Page = () => {
  return (
    <>
    <h1 className="text-[27px] text-[#414141] font-family font-extrabold">
    <PageTitle title="All Leads" />
    </h1>
      <LeadsTable />
    </>
  );
};

export default Page;
