import AllShipmentsTable from '@/app/(broker)/broker-dashboard/components/AllShipmentsTable'
import { PageTitle } from '@/components/PageTitle'
import React from 'react'

const page = () => {
  return (
  <>
    <h1 className="text-[27px] text-[#414141] font-family font-extrabold">
    <PageTitle title="All Shipments" />
    </h1>

    <AllShipmentsTable />
  </>
  )
}

export default page