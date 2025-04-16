'use client'
import type { Metadata } from "next";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { PageTitle } from "@/components/PageTitle";
import { EmployeeMetrics } from "@/components/EmployeeMetrics";
import EmployeeTaskList from "./view-tasks/[id]/EmployeeTaskList";



export default function EmployeeDashboard() {
  return (
       <>
         <PageTitle title="Employee Dashboard" />
         <h1 className="text-lg font-semibold mb-4">Overview</h1>
   
         {/* Main Grid Layout (8-Column + 4-Column) */}
         <div className="grid grid-cols-12 gap-6">
           {/* Left Section (8 Columns) */}
           <div className="col-span-12 xl:col-span-8 space-y-6">
<EmployeeMetrics/>
   
     {/* Wrap in a Flex Grid for Large Screens */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <EmployeeTaskList/>
     </div>
   
     {/* <RecentOrders /> */}
   </div>
   
   
           {/* Right Section (4 Columns) */}
           <div className="col-span-12 xl:col-span-4 space-y-6">
             <MonthlyTarget />
             {/* <MonthlySalesChart /> */}
             {/* <DemographicCard /> */}
           </div>
         </div>
       </>
  );
}
