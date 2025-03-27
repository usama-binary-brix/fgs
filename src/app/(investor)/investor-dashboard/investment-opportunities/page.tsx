
import InventoryTable from "./components/inventorytable/page";
import { PageTitle } from "@/components/PageTitle";
import { Metadata } from "next";
import InvestmentOpportunityTable from "./components/InvestmentOpportunityTable";



export const metadata: Metadata = {
  title: "Investment Opportunities",
  description: "Investment Opportunities",
};

const InventoryPage = () => {



  return (
    <>
     <h1 className="text-xl font-bold text-black mb-5">
     <PageTitle  title="Investment Opportunities" />
     </h1>
     <InvestmentOpportunityTable/>
    </>

  );
};

export default InventoryPage;

