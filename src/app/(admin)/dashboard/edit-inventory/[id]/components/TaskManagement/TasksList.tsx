import TaskAccordion from '@/components/TaskAccordion'
import Button from '@/components/ui/button/Button'
import React, { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import AddTaskModal from './AddTaskModal'
import { useGetAllAdminEmployeeTasksQuery } from '@/store/services/api'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'

const TasksList = () => {
  const { id } = useParams()
  const user = useSelector((state: any) => state.user.user.account_type)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data, isError, } = useGetAllAdminEmployeeTasksQuery(id)
  console.log(isError, 'error')
  const handleUpdate = (taskId: any, updatedDetails: any) => {
    console.log(`Task ${taskId} updated with:`, updatedDetails);
  }





  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-lg font-semibold'>Task List</p>
        <div className='flex gap-3 items-center'>
          <div className="inline-flex items-center gap-3">
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <div className="relative">

                  <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161]" />
                  <input
                    className="text-xs border placeholder-[#616161]  bg-white rounded-lg pl-9 pr-2 h-9 w-64 border-[#DDD] font-family font-medium text-[12.5px] text-[#616161] focus:border-gray-400 focus:outline-none"
                    placeholder="Search"
                  />
                </div>

              </div>
            </div>
          </div>
          <Button variant="primary"
            size='sm'
            onClick={handleOpenModal}
          >
            Add New Task
          </Button>

        </div>
      </div>

      {isError ? (
        <>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-gray-500 text-lg mb-4">
              No tasks available
            </div>
          </div>
        </>
      ) : (
        <div>
          {data?.task?.map((task: any) => (
            <TaskAccordion
              id={task.id}
              key={task.id}
              title={task.task_name}
              assignedUsers={task.employee}
              startDate={task.start_date}
              dueDate={task.due_date}
              status={task.status}
              priority={task.priority}
              initialDetails={task.task_description}
              onSubmitTask={(details) => handleUpdate(task.id, details)}
            />
          ))}
        </div>

      )}


      <AddTaskModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

export default TasksList