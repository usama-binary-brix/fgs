
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
      <PageTitle title="All Leads" />
      <LeadsTable />
    </>
  );
};

export default Page;
