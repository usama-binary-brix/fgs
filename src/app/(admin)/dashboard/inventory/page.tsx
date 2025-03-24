
import InventoryTable from "./components/inventorytable/page";
import { PageTitle } from "@/components/PageTitle";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "All Inventry",
  description: "All Inventry",
};

const InventoryPage = () => {



  return (
    <>
     <h1 className="text-xl font-bold text-black mb-5">
     <PageTitle  title="All Inventry" />
     </h1>
      <InventoryTable />
    </>

  );
};

export default InventoryPage;

