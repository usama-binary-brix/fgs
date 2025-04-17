import Button from '@/components/ui/button/Button'
import React, { useEffect, useState } from 'react'
import EditTimelineModal from './EditTimelineModal'
import TaskAccordion from '@/components/TaskAccordion'
import TasksList from './TaskManagement/TasksList'
import { useGetAllTimelineQuery } from '@/store/services/api'
import { useParams } from 'next/navigation'
import CustomizedTimeline from './CustomizedTimeline'

const Reconditioning = () => {
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
        <p className='text-lg font-semibold'>Reconditioning Timeline:</p>
     
        <Button variant="primary"
            size='sm'
            onClick={handleOpenEditTimeline}
          >
            Edit Timeline
          </Button>
      </div>
    <CustomizedTimeline steps={timelineData?.timeLine}/>
<TasksList/>
    <EditTimelineModal open={openTimelineModal} onClose={handleCloseModal}/>
    </>
  )
}

export default Reconditioning