
import InventoryTable from "./components/inventorytable/page";
import { PageTitle } from "@/components/PageTitle";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "All Inventory",
  description: "All Inventory",
};

const InventoryPage = () => {



  return (
    <>
     <h1 className="text-[27px]  font-extrabold font-family text-[#414141] mb-5">
     <PageTitle  title="All Inventory" />
     </h1>
      <InventoryTable />
    </>

  );
};

export default InventoryPage;

