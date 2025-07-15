'use client'
import Button from '@/components/ui/button/Button'
import React, { useState } from 'react'
import { useGetAllTimelineQuery, useGetInventoryByIdQuery } from '@/store/services/api'
import CustomizedTimeline from '@/app/(admin)/dashboard/edit-inventory/[id]/components/CustomizedTimeline'
import { useParams } from 'next/navigation'
import EmployeeTaskList from './EmployeeTaskList'
import { QRCodeCanvas } from 'qrcode.react'

const EmployeeViewTask = () => {
  const [openTimelineModal, setOpenEditTimelineModal] = useState(false)
  const handleOpenEditTimeline = () => {
    setOpenEditTimelineModal(true)
  }
  const handleCloseModal = () => {
    setOpenEditTimelineModal(false)
  }
  const { id } = useParams()
  const { data: timelineData, error, isLoading: allTimelineLoading, refetch } = useGetAllTimelineQuery(id);
  const { data: inventoryData, error: inventoryError, } = useGetInventoryByIdQuery(id);
  return (
    <>



      <div className="flex justify-between bg-white rounded shadow-md p-3 items-center">
        <div>
          <h1 className="text-2xl font-bold">{inventoryData?.inventory?.listing_number}  </h1>
          <p className="text-gray-600">Inventory</p>
          {/* <div className="flex gap-2 mt-2">
                <button
                  className={`border border-[#D184281A] text-[13px] font-family py-2 px-4 font-semibold rounded transition-all duration-300
                    ${activeTab === "details" ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`border border-[#D184281A] text-[13px] font-family py-2 px-4 font-semibold rounded transition-all duration-300
                    ${activeTab === "shipment" ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                  onClick={() => setActiveTab("shipment")}
                >
                  Shipments
                </button>
                <button
                  className={`border border-[#D184281A] text-[13px] font-family py-2 px-4 font-semibold rounded transition-all duration-300
                    ${activeTab === "reconditioning" ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                  onClick={() => setActiveTab("reconditioning")}
                >
                  Reconditioning
                </button>
              </div> */}
        </div>
    
        {/* <button
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <FaEdit /> {isEditing ? "Cancel" : "Edit"}
            </button> */}
      </div>





      <div className="flex justify-between items-center mt-3">
        {/* <h1 className="text-[#000] text-[17px] font-family font-semibold">Timeline</h1> */}
        <p className='text-lg font-semibold'>Reconditioning Timeline:</p>


      </div>
      <CustomizedTimeline steps={timelineData?.timeLine} timelineData={timelineData} />
      <EmployeeTaskList Inventorydata={inventoryData}/>
    </>
  )
}

export default EmployeeViewTask