"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthData {
  sold_percent: number;
  inprogress_percent: number;
}

interface ApiData {
    [month: string]: MonthData;
  }
  
  interface Props {
    data: {
      inventory_stats_by_month: ApiData;
      total_projects?: number;
    };
  }
  
  export default function AllProjectsStatitics({ data }: Props) {
    const months = Object.keys(data?.inventory_stats_by_month || {});
    const monthData = data?.inventory_stats_by_month || {};
    const totalProjects = data?.total_projects || 0;

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    colors: ["#1E90FF", "#FFA500"], // Orange for In Progress, Blue for Sold
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 5,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
      y: {
        formatter: (value) => `${value}%`,
      },
    },
    xaxis: {
      type: "category",
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        formatter: function(value: string) {
          if (!value) return '';
          return value.toString().slice(0, 3);
        }
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (value) => `${value}%`,
      },
      title: {
        text: "Percentage",
        style: {
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "right",
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
  };

  const series = [
    {
        name: "In Progress",
        data: months.map(month => monthData[month].inprogress_percent),
      },
      
    {
      name: "Sold Projects",
      data: months.map(month => monthData[month].sold_percent),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-0 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-0 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold pl-4 text-gray-800 dark:text-white/90">
            Projects
          </h3>
          <h4 className=" font-bold pl-4 text-gray-800 text-[34px] dark:text-white/90">
          {totalProjects}
          </h4>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-full pr-3">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={250}
          />
        </div>
      </div>
    </div>
  );
}
