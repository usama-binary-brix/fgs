"use client";
import { useGetBrokerDashboardQuery } from "@/store/services/api";
import React from "react";
import { MdInfoOutline } from "react-icons/md";

export const BrokerMetrics = () => {

      const { data, isLoading, error } = useGetBrokerDashboardQuery("");


  const metricsData = [
    {
      title: "Total Quotes",
      value: data?.total_quote || '0',
      icon: <MdInfoOutline />,
    },
    {
      title: "In-Progress Shipments",
      value: data?.inprogress_quote || '0',
      icon: <MdInfoOutline />,
    },
    {
      title: "Completed Shipments",
      value: data?.acceptd_quote || '0',
      icon: <MdInfoOutline />,
    },
    // {
    //   title: "Pending Quotes",
    //   value: "60",
    //   icon: <MdInfoOutline />,
    // },
    {
      title: "Total Earnings $",
      value: `$${data?.total_earning || '0.00'}`,
      icon: <MdInfoOutline />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-3">
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
              <h4 className="mt-2 font-bold text-gray-800 text-[40px] dark:text-white/90">
                {item.value}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
