'use client'

import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart'
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget'
import { PageTitle } from '@/components/PageTitle'
import React, { useEffect } from 'react'
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { useGetAdminDashboardStatesQuery } from '@/store/services/api'
import { AdminMatrics } from './DashboardComponents/AdminMetrics'
import TopInvestorsChart from './DashboardComponents/TopInvestorsChart'
import AllProjectsStatitics from './DashboardComponents/AllProjectsStatitics'
import ProjectStages from './DashboardComponents/ProjectStages'

const AdminDashbOard = () => {
    const { data, error, isLoading, refetch } = useGetAdminDashboardStatesQuery('')
    useEffect(() => {
        refetch()
    }, [refetch])


    return (

        <>
 <div className="min-h-[95vh] flex flex-col">
    {/* Page content */}
    <div className="flex-grow">
      <PageTitle title="Admin Dashboard" />
      <h1 className="text-lg font-semibold mb-2">Overview</h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <AdminMatrics data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AllProjectsStatitics data={data} />
            <MonthlySalesChart data={data} />
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <ProjectStages data={data} />
          <TopInvestorsChart data={data} />
        </div>
      </div>
    </div>

    {/* Footer always at the bottom */}
    <div className="text-center text-xs text-[#616161] py-4 dark:text-gray-400">
      Copyright &copy; {new Date().getFullYear()} - First Group Services
    </div>
  </div>
        </>

    )
}

export default AdminDashbOard