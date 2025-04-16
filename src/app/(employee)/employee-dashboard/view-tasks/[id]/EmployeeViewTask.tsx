'use client'
import Button from '@/components/ui/button/Button'
import React, { useState } from 'react'
import { useGetAllTimelineQuery } from '@/store/services/api'
import CustomizedTimeline from '@/app/(admin)/dashboard/edit-inventory/[id]/components/CustomizedTimeline'
import { useParams } from 'next/navigation'
import EmployeeTaskList from './EmployeeTaskList'

const EmployeeViewTask = () => {
  const [openTimelineModal, setOpenEditTimelineModal] = useState(false)
  const handleOpenEditTimeline = ()=>{
    setOpenEditTimelineModal(true)
  }
  const handleCloseModal = ()=>{
    setOpenEditTimelineModal(false)
  }
const {id} = useParams()
 const { data: timelineData, error, isLoading: allTimelineLoading, refetch } = useGetAllTimelineQuery(id);

  return (
    <>
     <div className="flex justify-between items-center mt-3">
        {/* <h1 className="text-[#000] text-[17px] font-family font-semibold">Timeline</h1> */}
        <p className='text-lg font-semibold'>Timeline</p>
     
        
      </div>
    <CustomizedTimeline steps={timelineData?.timeLine}/>
<EmployeeTaskList/>
    </>
  )
}

export default EmployeeViewTask