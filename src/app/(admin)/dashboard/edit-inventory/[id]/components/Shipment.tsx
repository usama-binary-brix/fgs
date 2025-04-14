
import Button from '@/components/ui/button/Button';
import React, { useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi';
import CreateShipmentModal from './CreateShipmentModal';

const Shipment = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [activeBoundTab, setActiveBoundTab] = useState("inbound");
  const [createShipmentModal, setCreateShipmentModal] = useState(false);

  const handlCreateShipmentOpenModal = () => {
    setCreateShipmentModal(true);
  } 

  const handleCreateShipmentCloseModal = () => {
    setCreateShipmentModal(false);
  }

  return (
    <>
      <div className="row">
        <div className="grid-cols-1">
          <div className="flex gap-2 mt-5">
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

          </div>
          {activeTab === "details" && (
            <>
              <div className="mt-5 flex items-center justify-between">
                <h2 className="text-[17px] font-medium font-family text-[#000]">All Shipments</h2>
                <Button onClick={handlCreateShipmentOpenModal} size='sm'>Create Shipment</Button>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  className={`border border-[#D184281A] text-[13px] font-family py-2 px-4 font-semibold rounded transition-all duration-300
                ${activeBoundTab === "inbound" ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                  onClick={() => setActiveBoundTab("inbound")}
                >
                  inbound
                </button>
                <button
                  className={`border border-[#D184281A] text-[13px] font-family py-2 px-4 font-semibold rounded transition-all duration-300
                ${activeBoundTab === "outbound" ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                  onClick={() => setActiveBoundTab("outbound")}
                >
                  outbound
                </button>

              </div>
              {activeBoundTab === "inbound" && (
                <div className='bg-[#F7F7F7] p-3 gap-2 mt-5 rounded-lg flex justify-center flex-col items-center'>
                 <FiPlusCircle size={60} strokeWidth={1.5} color='#616161' />
                  <p className='text-[16px] font-normal font-family text-[#616161]'>No Shipments Found! To create one click the button</p>

                </div>
              )}

              <CreateShipmentModal open={createShipmentModal} onClose={handleCreateShipmentCloseModal} />

            </>


          )}
        </div>
      </div>

    </>
  )
}

export default Shipment