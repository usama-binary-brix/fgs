import React from 'react'
import CustomerLeads from './CustomerLeads'
import { PageTitle } from '@/components/PageTitle'

const page = () => {
  return (
   <>
    <h1 className="text-[27px] text-[#414141] font-family font-extrabold">
    <PageTitle title="Customer Leads" />
    </h1>
   <CustomerLeads/>
   
   </>
  )
}

export default page