import type { Metadata } from "next";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { PageTitle } from "@/components/PageTitle";
import { EmployeeMetrics } from "@/components/EmployeeMetrics";
import EmployeeTaskList from "./view-tasks/[id]/EmployeeTaskList";
import EmployeeDashboard from "./EmployeeDashboard";

export const metadata: Metadata = {
  title: "FGS Admin Dashboard",
  description: "FGS Admin Dashboard",
};

export default function Ecommerce() {
  return (
       <>
        <EmployeeDashboard/>
       </>
  );
}
