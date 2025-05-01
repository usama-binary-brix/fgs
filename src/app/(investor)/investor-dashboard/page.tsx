import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { PageTitle } from "@/components/PageTitle";
import BarChart from "./components/BarChart";

export const metadata: Metadata = {
  title: "FGS Admin Dashboard",
  description: "FGS Admin Dashboard",
};

export default function Ecommerce() {
  return (
    <>
      <PageTitle title="Investor Dashboard" />
      <h1 className="text-lg font-semibold mb-4">Overview</h1>

      {/* Main Grid Layout (8-Column + 4-Column) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Section (8 Columns) */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <EcommerceMetrics />
          {/* Wrap in a Flex Grid for Large Screens */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* <StatisticsChart />
            <MonthlySalesChart /> */}
<BarChart/>

          </div>

          {/* <RecentOrders /> */}
        </div>


        {/* Right Section (4 Columns) */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* <MonthlyTarget /> */}
          {/* <MonthlySalesChart /> */}
          {/* <DemographicCard /> */}
        </div>
      </div>
    </>
  );
}
