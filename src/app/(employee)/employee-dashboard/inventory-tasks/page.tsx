import React from 'react'
import EmployeeInventoryTasksTable from './components/EmployeeInventoryTasksTable'
import { PageTitle } from '@/components/PageTitle'

const page = () => {

    
  return (
<>

<h1 className="text-[27px]  font-extrabold font-family text-[#414141] mb-5">
     <PageTitle  title="All Inventory Tasks" />
     </h1>
<EmployeeInventoryTasksTable/>

</>
)
}

export default page