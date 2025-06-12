import React from 'react'
import InvestorLeadsTables from './InvestorLeadsTables'
import { PageTitle } from '@/components/PageTitle'

const page = () => {
  return (
    <>
     
    <h1 className="text-[27px] text-[#414141] font-family font-extrabold">
    <PageTitle title="Investor Leads" />
    </h1>
    <InvestorLeadsTables/>
    </>
  )
}

export default page