import type { Metadata } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import { BrokerMetrics } from "@/components/ecommerce/BrokerMetrics";

export const metadata: Metadata = {
  title: "FGS Broker Dashboard",
  description: "FGS Broker Dashboard",
};

export default function Ecommerce() {
  return (
    <>
      <PageTitle title="Shipment Broker’s Dashboard" />
      <h1 className="text-lg font-semibold mb-4">Overview</h1>

      {/* Main Grid Layout (8-Column + 4-Column) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Section (8 Columns) */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <BrokerMetrics />

        </div>


      </div>
    </>
  );
}
