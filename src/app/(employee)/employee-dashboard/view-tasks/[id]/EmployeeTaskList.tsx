import TaskAccordion from '@/components/TaskAccordion'
import Button from '@/components/ui/button/Button'
import React, { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { useGetAllAdminEmployeeTasksQuery } from '@/store/services/api'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'

const EmployeeTaskList = () => {
const {id} = useParams()
const user = useSelector((state:any)=>state.user.user.account_type)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

const {data} = useGetAllAdminEmployeeTasksQuery(id)

 

    const handleUpdate = (taskId:any, updatedDetails:any) => {
      console.log(`Task ${taskId} updated with:`, updatedDetails);



    }
  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-lg font-semibold'>Task:List</p>
   
      </div>
      
      
      
      <div>
      {data?.task?.map((task:any) => (
        <TaskAccordion
          key={task.id}
          title={task.task_name}
          assignedUsers={task.employee}
          startDate={task.start_date}
          dueDate={task.due_date}
          status={task.status}
          priority={task.priority}
          initialDetails={task.task_details}
          onSubmitTask={(details) => handleUpdate(task.id, details)}
        />
      ))}
    </div>
    </>
  )
}

export default EmployeeTaskList