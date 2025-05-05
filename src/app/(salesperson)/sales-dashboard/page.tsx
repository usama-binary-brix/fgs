import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { PageTitle } from "@/components/PageTitle";
import LeadsTable from "./leads/components/LeadsTable";

export const metadata: Metadata = {
  title: "FGS Sales ",
  description: "FGS Sales",
};

export default function Ecommerce() {
  return (
      <>
        <h1 className="text-[27px] text-[#414141] font-family font-extrabold">
    <PageTitle title="All Leads" />
    </h1>
      <LeadsTable />
   
      </>
  );
}
