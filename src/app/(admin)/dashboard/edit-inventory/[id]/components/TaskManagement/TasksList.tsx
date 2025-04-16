import TaskAccordion from '@/components/TaskAccordion'
import Button from '@/components/ui/button/Button'
import React, { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import AddTaskModal from './AddTaskModal'
import { useGetAllAdminEmployeeTasksQuery } from '@/store/services/api'
import { useParams } from 'next/navigation'

const TasksList = () => {
const {id} = useParams()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

const {data} = useGetAllAdminEmployeeTasksQuery(id)
console.log(data, 'data')

  const tasks = [
    {
      id: 1,
      title: "Excavator Overhaul",
      assignedUsers: [
        { name: "User 1", avatar: "/user1.jpg" },
        { name: "User 2", avatar: "/user2.jpg" },
      ],
      startDate: "02-26-2024",
      dueDate: "03-15-2024",
      status: "Completed",
      priority: "High",
      task_details: "Check engine, hydraulics and repaint.",
    },
    {
      id: 2,
      title: "Crane Inspection",
      assignedUsers: [
        { name: "User 3", avatar: "/user3.jpg" },
        { name: "User 4", avatar: "/user4.jpg" },
      ],
      startDate: "03-01-2024",
      dueDate: "03-10-2024",
      status: "Pending",
      priority: "Medium",
      task_details: "Safety inspection scheduled.",
    },
    {
      id: 3,
      title: "Bulldozer Maintenance",
      assignedUsers: [
        { name: "User 5", avatar: "/user5.jpg" },
      ],
      startDate: "03-05-2024",
      dueDate: "03-20-2024",
      status: "In Progress",
      priority: "Low",
      task_details: "Oil change and track inspection.",
    },
  ];
  

    const handleUpdate = (taskId:any, updatedDetails:any) => {
      console.log(`Task ${taskId} updated with:`, updatedDetails);



    }
  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-lg font-semibold'>Task:List</p>
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
      
      
      
      <div>
      {data?.task?.map((task:any) => (
        <TaskAccordion
          key={task.id}
          title={task.task_name}
          assignedUsers={task.assignedUsers}
          startDate={task.start_date}
          dueDate={task.due_date}
          status={task.status}
          priority={task.priority}
          initialDetails={task.task_details}
          onSubmitTask={(details) => handleUpdate(task.id, details)}
        />
      ))}
    </div>




      <AddTaskModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

export default TasksList