'use client'
import React, { useEffect } from "react";
import { PageTitle } from "@/components/PageTitle";
import { EmployeeMetrics } from "@/components/EmployeeMetrics";
import { useGetEmployeeDashboardQuery } from "@/store/services/api";
import TaskAccordion from "@/components/TaskAccordion";
import EmployeeComplitionrate from "./components/EmployeeComplitionrate";

export default function EmployeeDashboard() {
  const { data, error, isLoading, refetch } = useGetEmployeeDashboardQuery('')
  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <>
      <PageTitle title="Employee Dashboard" />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <h1 className="text-lg font-semibold mb-4">Overview</h1>
          <EmployeeMetrics data={data} />

          <EmployeeComplitionrate data={data} />
        </div>
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="max-h-[100vh] overflow-auto bg-white p-4 rounded-lg">
              <div className=" relative">
                <p className="text-lg font-semibold">Task: List</p>
                <div className="relative">
                  {/* <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white text-gray-700 text-sm shadow-sm hover:bg-gray-100 transition"
          >
            <IoCalendarOutline className="text-xl" />
            <span className="font-medium">{selectedFilter}</span>
            <MdKeyboardArrowDown className="text-xl" />
          </button> */}

                  {/* Dropdown Options */}
                  {/* {isDropdownOpen && (
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
          )} */}
                </div>
              </div>

              <div>
                {data?.employee_task?.map((task: any) => (
                  <TaskAccordion
                    id={task.id}
                    key={task.id}
                    title={task.task_name}
                    startDate={task.start_date}
                    dueDate={task.due_date}
                    status={task.status}
                    priority={task.priority}
                    initialDetails={task.task_description}
                    isEmployeeDashboard={true}
                    inventoryId={task?.inventory_id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
