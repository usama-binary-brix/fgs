// 'use client'
// import dynamic from 'next/dynamic';
// import { ApexOptions } from 'apexcharts';

// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// const BarChart = (data:any) => {
//   console.log('first', data?.data?.monthly_investment)


//   const series = [
//     {
//       name: 'Sales',
//       data: [30, 40, 45, 40, 40, 45, 50, 70, 60, 80, 90, 100]
//     },
//   ];

//   const categories = [
//     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//   ];

//   const options: ApexOptions = {
//     chart: {
//       type: 'area',
//       toolbar: {
//         show: false,
//       },
//     },
//     colors: ['##4CAF50AD'],
//     plotOptions: {
//       area: {
//         fillTo: 'origin',
//       },
//     },
//     grid: {
//       show: true,
//       borderColor: '#4CAF50AD',
//       strokeDashArray: 0,
//       position: 'back',
//       xaxis: {
//         lines: {
//           show: true
//         }
//       },
//       yaxis: {
//         lines: {
//           show: true
//         }
//       },
//       padding: {
//         top: 0,
//         right: 0,
//         bottom: 0,
//         left: 0
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: 'straight',
//       width: 2,
//       lineCap: 'square',
//       colors: ['#4CAF50AD'],
//     },
//     fill: {
//       type: 'gradient',
//       gradient: {
//         shadeIntensity: 1,
//         opacityFrom: 0.7,
//         opacityTo: 0.3,
//         stops: [0, 90, 100],
//         colorStops: [
//           {
//             offset: 0,
//             color: '#4CAF50AD',
//             opacity: 1
//           },
//           {
//             offset: 100,
//             color: '#4CAF50AD',
//             opacity: 0.1
//           }
//         ]
//       },
//     },
//     xaxis: {
//       categories: categories,
//     },
//     yaxis: {
//       labels: {
//         align: 'left',
//       },
//       min: 0,
//       max: 100,
//       tickAmount: 10,
//     },
//     tooltip: {
//       y: {
//         formatter: (val: number) => `$${val}`,
//       },
//     },
//   };

//   return (
//     <div className="bar-chart">
//       <Chart
//         options={options}
//         series={series}
//         type="area"
//         height={500}
//       />
//     </div>
//   );
// };

// export default BarChart;


'use client'
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = (data: any) => {
  // Extract monthly investment data
  const monthlyData = data?.data?.monthly_investment || {};

  // Prepare data for chart
  const categories = Object.keys(monthlyData).map(month => {
    // Convert "Month Year" format to short month name
    return month.split(' ')[0].substring(0, 3);
  });

  const seriesData = Object.values(monthlyData).map((monthData: any) => {
    // You can choose which value to display here - I'm using total_profit
    return monthData.total_profit;
  });

  const series = [
    {
      name: 'Profit',
      data: seriesData,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    colors: ['##4CAF50AD'],
    plotOptions: {
      area: {
        fillTo: 'origin',
      },
    },
    grid: {
      show: true,
      borderColor: '#4CAF50AD',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      width: 2,
      lineCap: 'square',
      colors: ['#4CAF50AD'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#4CAF50AD',
            opacity: 1
          },
          {
            offset: 100,
            color: '#4CAF50AD',
            opacity: 0.1
          }
        ]
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      labels: {
        align: 'left',
      },
      // Calculate max value dynamically with some padding
      min: 0,
      max: Math.max(...seriesData, 100) * 1.1, // 10% padding
      tickAmount: 10,
    },
    tooltip: {
      y: {
        // Show the full month name and year in tooltip
        formatter: (val: number, { dataPointIndex }: { dataPointIndex: number }) => {
          const monthName = Object.keys(monthlyData)[dataPointIndex];
          return `${monthName}: $${val}`;
        },
      },
    },
  };

  return (
    <div className="bar-chart">
      <Chart
        options={options}
        series={series}
        type="area"
        height={500}
      />
    </div>
  );
};

export default BarChart;