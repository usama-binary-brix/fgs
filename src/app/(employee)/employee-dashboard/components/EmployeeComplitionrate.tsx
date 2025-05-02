"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () =>    <div className="py-6 flex items-center justify-center h-24">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>,
});

interface TaskData {
    pending_task: number;
    active_task: number;
    completed_task: number;
    total_task: number;
    pending_percentage: number;
    active_percentage: number;
    completed_percentage: number;
    employee_task: Array<{
        id: number;
        task_name: string;
        status: string;
    }>;
}

const EmployeeCompletionRate = ({ data }: { data: TaskData }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Use the actual data from props instead of hardcoded values
    const chartSeries = [
        data?.completed_percentage, 
        data?.active_percentage, 
        data?.pending_percentage,
        // data?.total_task
    ];

    const completionRate = data?.completed_percentage;
    const chartOptions: ApexOptions = {
        chart: {
            type: "donut",
            height: 300,
        },
        colors: ["#D18428", "#FFB359", "#FFF1E0", ],
        labels: ["Completed Tasks", "In-Progress", "Pending",],
        dataLabels: {
            enabled: false,
        },
        // legend: {
        //     show: true,
        // },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: false,
                            fontFamily: "Inter, sans-serif",
                            offsetY: 40,
                        },
                        total: {
                            showAlways: true,
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            formatter: () => `${completionRate.toLocaleString()}%`,
                        },
                        value: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            formatter: (value) => `$${parseInt(value).toLocaleString()}`,
                        },
                    },
                    size: "70%",
                },
                customScale: 1,
                offsetX: 0,
                offsetY: 0,
                expandOnClick: true,
                dataLabels: {
                    offset: 0,
                    minAngleToShowLabel: 10
                }
            },
        },
        stroke: {
            show: false,
        },
        tooltip: {
            enabled: true,
        },
    };

    useEffect(() => {
        const timeout = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Overall Completion Rate
                </h2>

            </div>

            {isLoading ? (
                 <div className="py-6 flex items-center justify-center h-24">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               </div>
            ) : (
                <div>
                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="donut"
                        height={300}
                    />
            
                </div>
            )}
        </div>
    );
};



export default EmployeeCompletionRate;
