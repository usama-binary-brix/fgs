"use client";
import React from "react";
import { MdInfoOutline } from "react-icons/md";

export const BrokerMetrics = () => {
  const metricsData = [
    {
      title: "Total Quotes Accepted",
      value: "155",
      icon: <MdInfoOutline />,
    },
    {
      title: "In-Progress Shipments",
      value: "10",
      icon: <MdInfoOutline />,
    },
    {
      title: "Completed Shipments",
      value: "85",
      icon: <MdInfoOutline />,
    },
    {
      title: "Pending Quotes",
      value: "60",
      icon: <MdInfoOutline />,
    },
    {
      title: "Total Earnings $",
      value: "3500",
      icon: <MdInfoOutline />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 md:gap-3">
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
