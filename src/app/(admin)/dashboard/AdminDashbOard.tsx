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
            <PageTitle title="Admin Dashboard" />
            <h1 className="text-lg font-semibold mb-2">Overview</h1>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-8 space-y-6">
                    <AdminMatrics data={data} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AllProjectsStatitics data={data} />
                    <MonthlySalesChart data={data}/>

                    </div>
                </div>
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    <ProjectStages data={data}/>
                    <TopInvestorsChart data={data} />

                    {/* <MonthlySalesChart /> */}
                    {/* <DemographicCard /> */}
                </div>
            </div>
            <div className='flex items-center justify-center mt-4'>
                <p className='text-xs text-[#616161]'>Copyright © 2025 - First Group Services</p>

            </div>


        </>

    )
}

export default AdminDashbOard