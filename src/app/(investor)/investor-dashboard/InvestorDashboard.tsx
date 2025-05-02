'use client'

import { PageTitle } from '@/components/PageTitle'
import React, { useEffect } from 'react'
import { InvestorMetrics } from './components/InvestorMatrics'
import BarChart from './components/BarChart'
import TopProjectInvestment from './components/TopProjectInvestments'
import RecentProfits from './components/RecentProfits'
import { useGetInvestorDashboardQuery } from '@/store/services/api'

const InvestorDashboard = () => {


   const { data, error, isLoading, refetch } = useGetInvestorDashboardQuery('')
      useEffect(() => {
          refetch()
      }, [refetch])
  return (
   <>
   
      <PageTitle title="Investor Dashboard" />
      <h1 className="text-lg font-semibold mb-4">Overview</h1>


      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-12 xl:col-span-8 space-y-6">
          <InvestorMetrics data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

            <BarChart data={data}/>

          </div>

        </div>



        <div className="col-span-12 xl:col-span-4 space-y-6">
          <TopProjectInvestment data={data} />
            <RecentProfits data={data}/>
        </div>
      </div>
   
   
   
   </>
  )
}

export default InvestorDashboard