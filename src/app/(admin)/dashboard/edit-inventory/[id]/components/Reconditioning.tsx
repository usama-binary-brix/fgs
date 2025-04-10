import Button from '@/components/ui/button/Button'
import React, { useState } from 'react'
import Timeline from './Timeline'
import EditTimelineModal from './EditTimelineModal'
import TaskAccordion from '@/components/TaskAccordion'
import TasksList from './TaskManagement/TasksList'

const Reconditioning = () => {
  const [openTimelineModal, setOpenEditTimelineModal] = useState(false)
  const handleOpenEditTimeline = ()=>{
    setOpenEditTimelineModal(true)
  }
  const handleCloseModal = ()=>{
    setOpenEditTimelineModal(false)
  }
  return (
    <>
     <div className="flex justify-between items-center mt-3">
        <h1 className="text-[#000] text-[17px] font-family font-medium">Timeline</h1>
     
        <Button variant="primary"
            size='sm'
            onClick={handleOpenEditTimeline}
          >
            Edit Timeline
          </Button>
      </div>
    <Timeline/>
<TasksList/>
    <EditTimelineModal open={openTimelineModal} onClose={handleCloseModal}/>
    </>
  )
}

export default Reconditioning