import type { Metadata } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import BrokerTable from "./components/BrokerTable";

export const metadata: Metadata = {
  title: "FGS Broker Dashboard",
  description: "FGS Broker Dashboard",
};

export default function Ecommerce() {
  return (
    <>
     <h1 className="text-[27px] text-[#414141] font-family font-extrabold mb-5">
     <PageTitle title="Shipment Broker’s Dashboard" />
     </h1>
      <BrokerTable />
    
    </>
  );
}
