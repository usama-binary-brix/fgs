import TaskAccordion from '@/components/TaskAccordion'
import React, { useState } from 'react'
import { IoCalendarOutline } from 'react-icons/io5'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useGetAllEmployeesTasksQuery } from '@/store/services/api'
import { useParams } from 'next/navigation'

const EmployeeTaskList = ({Inventorydata}:any) => {
  const { id } = useParams()
  const { data } = useGetAllEmployeesTasksQuery(id)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('All Tasks')

  const handleUpdate = (taskId: any, updatedDetails: any) => {
    console.log(`Task ${taskId} updated with:`, updatedDetails)
  }
console.log('first', Inventorydata?.inventory)
  const handleSelect = (option: string) => {
    setSelectedFilter(option)
    setIsDropdownOpen(false)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 relative">
        <p className="text-lg font-semibold">Task: List</p>

        {/* Dropdown Button */}
        {/* <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white text-gray-700 text-sm shadow-sm hover:bg-gray-100 transition"
          >
            <IoCalendarOutline className="text-xl" />
            <span className="font-medium">{selectedFilter}</span>
            <MdKeyboardArrowDown className="text-xl" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              {['All Tasks', 'Pending Tasks', 'Completed Tasks'].map((option) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>

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
            statuses={task.statuses}
sellingPrice={Inventorydata?.inventory?.selling_price
}
          />
        ))}
      </div>
    </>
  )
}

export default EmployeeTaskList
