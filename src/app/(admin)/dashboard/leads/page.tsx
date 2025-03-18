
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import LeadsTable from "./components/LeadsTable";
import { PageTitle } from "@/components/PageTitle";
import { Metadata } from "next";
import TopButtons from "@/components/Buttons/TopButtons";

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
