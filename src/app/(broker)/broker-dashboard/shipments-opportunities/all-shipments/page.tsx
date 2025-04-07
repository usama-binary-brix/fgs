import { PageTitle } from '@/components/PageTitle'
import React from 'react'
import AllShipmentsTable from '../../components/AllShipmentsTable'

const page = () => {
  return (
  <>
    <h1 className="text-[27px] text-[#414141] font-family font-extrabold">
    <PageTitle title="All Shipments Opportunites" />
    </h1>

    <AllShipmentsTable />
  </>
  )
}

export default page