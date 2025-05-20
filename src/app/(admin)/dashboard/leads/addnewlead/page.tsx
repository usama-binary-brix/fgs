import React from 'react'
import AdminAddNewLead from './AdminAddNewLead'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "All Accounts",
  description: "All Accounts",
};

const page = () => {
  return (
    <>
    
    <AdminAddNewLead/>
    </>
  )
}

export default page