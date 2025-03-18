
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

     <div className="flex justify-between items-center mb-3">
     <div className="inline-flex items-center gap-3">
        <div className="hidden sm:block">
          <div className="flex items-center space-x-2">
            <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="text-xs border rounded-lg pl-9 pr-2 h-9 w-64 border-gray-300 focus:border-gray-400 focus:outline-none"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
          <TopButtons label="Edit Columns" variant="outlined" />
          <TopButtons label="Filters" variant="outlined" />
          <TopButtons label="Add New Account" variant="primary" />
     
        </div>
     </div>






      <LeadsTable />
    </>
  );
};

export default Page;
