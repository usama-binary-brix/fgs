'use client'
// components/BarChart.tsx
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BarChartProps {
  series: ApexAxisChartSeries;
  categories: string[];
  height?: number;
  width?: number | string;
}

const BarChart = () => {

    const series = [
        {
          name: 'Sales',
          data: [30, 40, 45, 50, 49, 60, 40, 40, 45, 50,70, 60]
        },
   
      ];
    
      const categories = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];


  const options: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false, // Hide the toolbar
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels on bars
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: 'Values', // Y-axis label
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val}`, // Format tooltip values
      },
    },
  };

  return (
    <div className="bar-chart">
      <Chart
        options={options}
        series={series}
        type="area"
        height={400}
 
      />
    </div>
  );
};

export default BarChart;