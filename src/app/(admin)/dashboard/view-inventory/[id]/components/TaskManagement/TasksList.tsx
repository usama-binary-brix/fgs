import TaskAccordion from '@/components/TaskAccordion'
import Button from '@/components/ui/button/Button'
import React, { useState } from 'react'
import { IoCalendarOutline, IoSearchOutline } from 'react-icons/io5'
import AddTaskModal from './AddTaskModal'
import { useGetAllAdminEmployeeTasksQuery } from '@/store/services/api'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useDebounce } from 'use-debounce'

const TasksList = () => {
  const { id } = useParams()
  const user = useSelector((state: any) => state.user.user.account_type)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userRole = useSelector((state: any) => state?.user?.user?.account_type)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('All Tasks')
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 800);

  const handleSelect = (option: string) => {
    setSelectedFilter(option)
    setIsDropdownOpen(false)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Create a mapping between display text and API filter values
  const filterMap: Record<string, string> = {
    'All Tasks': '',
    'Pending Tasks': 'pending',
    'Active Tasks': 'active',
    'Completed Tasks': 'completed'
  };

  // Updated query hook with both search and filter parameters
  const { data, isError } = useGetAllAdminEmployeeTasksQuery({
    id,
    search: debouncedSearchText,
    filter: filterMap[selectedFilter] // Use the mapped value here
  });

  const handleUpdate = (taskId: any, updatedDetails: any) => {
    console.log(`Task ${taskId} updated with:`, updatedDetails);
  }

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-lg font-semibold'>Task List</p>

        {(userRole === 'super_admin' || userRole === 'admin') && (
          <div className='flex gap-3 items-center'>
            <div className="inline-flex items-center gap-3">
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161]" />
                    <input
                      className="text-xs border placeholder-[#616161] bg-white rounded-lg pl-9 pr-2 h-9 w-64 border-[#DDD] font-family font-medium text-[12.5px] text-[#616161] focus:border-gray-400 focus:outline-none"
                      placeholder="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 border rounded-lg px-2 py-2 bg-white text-gray-700 text-sm shadow-sm hover:bg-gray-100 transition"
              >
                <IoCalendarOutline className="text-xl" />
                <span className="font-medium">{selectedFilter}</span>
                <MdKeyboardArrowDown className="text-xl" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 w-48 bg-white border rounded-lg shadow-lg z-10">
                  {['All Tasks', 'Pending Tasks', 'Active Tasks', 'Completed Tasks'].map((option) => (
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
            </div>

            <Button variant="primary" size='sm' onClick={handleOpenModal}>
              Add New Task
            </Button>
          </div>
        )}
      </div>

      {isError ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-gray-500 text-lg mb-4">
            No tasks available
          </div>
        </div>
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
              statuses={task.statuses}

            />
          ))}
        </div>
      )}

      <AddTaskModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

export default TasksList