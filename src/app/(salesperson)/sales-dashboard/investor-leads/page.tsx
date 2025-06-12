import { PageTitle } from '@/components/PageTitle'
import React from 'react'
import InvestorLeads from './InvestorLeads'

const page = () => {
  return (
    <>
    
    <h1 className="text-[27px] text-[#414141] font-family font-extrabold">
    <PageTitle title="Investor Leads" />
    </h1>
<InvestorLeads/>
    </>
  )
}

export default page