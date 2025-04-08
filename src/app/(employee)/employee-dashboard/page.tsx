import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { PageTitle } from "@/components/PageTitle";

export const metadata: Metadata = {
  title: "FGS Admin Dashboard",
  description: "FGS Admin Dashboard",
};

export default function Ecommerce() {
  return (
    <>
      <PageTitle title="Employee Dashboard" />

      
    </>
  );
}
