import { PageTitle } from '@/components/PageTitle'
import React from 'react'
import AccountsTable from './components/AccountsTable'
import { Metadata } from 'next'



export const metadata: Metadata = {
  title: "All Accounts",
  description: "All Accounts",
};

const page = () => {
  return (
    <>
    
    <PageTitle title="All Accounts" />
    <AccountsTable/>    
    </>
  )
}

export default page