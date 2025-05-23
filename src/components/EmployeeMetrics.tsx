"use client";
import React from "react";
import { MdInfoOutline } from "react-icons/md";

export const EmployeeMetrics = (data:any) => {

  const metricsData = [
    {
      title: "Pending Tasks",
      value: data?.data?.pending_task,
      icon: <MdInfoOutline />,
    },
    {
      title: "In-Progress Tasks",
      value: data?.data?.active_task,
      icon: <MdInfoOutline />,
    },
    {
      title: "Completed Tasks",
      value: data?.data?.completed_task,
      icon: <MdInfoOutline />,
    },

  ];

  return (
    <div className=" flex flex-col gap-4">
      {metricsData.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.title}
            </span>
            {item.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {item.value}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
