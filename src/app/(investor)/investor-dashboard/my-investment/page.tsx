import React from 'react'
import MyInvestmentTable from './MyInvestmentTable'
import { PageTitle } from '@/components/PageTitle'

const page = () => {
  return (
   <>
   
     <PageTitle  title="My Investment" />
   <MyInvestmentTable/>
   
   </>
  )
}

export default page