
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
     <PageTitle  title="Investment Opportunities" />

     <InvestmentOpportunityTable/>
    </>

  );
};

export default InventoryPage;

