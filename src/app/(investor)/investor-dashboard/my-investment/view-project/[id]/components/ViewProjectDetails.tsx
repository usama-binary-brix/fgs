'use client'
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import { useGetInventoryByIdQuery } from '@/store/services/api';
import { useFormik } from 'formik';
import { useParams } from 'next/navigation';
import React from 'react'

const ViewProjectDetails = () => {
  const { id } = useParams();
 const { data: inventoryData, error, isLoading } = useGetInventoryByIdQuery(id);
 const getValue = (value: any) => (value !== undefined && value !== null && value !== "" ? value : "---");
 const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); // Add leading zero
  const day = (`0${date.getDate()}`).slice(-2); // Add leading zero
  return `${year}-${month}-${day}`;
};


 const formik = useFormik({
  enableReinitialize: true,
  initialValues: {
    project_name: getValue(inventoryData?.inventory?.listing_number),
    purchase_date: formatDate(inventoryData?.inventory?.date_purchased),
    start_date: formatDate(inventoryData?.inventory?.created_at),
    completion_date: formatDate(inventoryData?.inventory?.updated_at),
    purchase_price: `$ ${getValue(inventoryData?.inventory?.price_paid)}`,
    elevator_manufacturer: getValue(inventoryData?.inventory?.make),
    elevator_model: getValue(inventoryData?.inventory?.model),
    elevator_serial: getValue(inventoryData?.inventory?.serial_no),
    project_status: "In-progress",
    project_description: `Listing: ${getValue(inventoryData?.inventory?.listing_number)}, Year: ${getValue(inventoryData?.inventory?.year)}, Height: ${getValue(inventoryData?.inventory?.height)}, Width: ${getValue(inventoryData?.inventory?.width)}, Weight: ${getValue(inventoryData?.inventory?.weight)}, Hours: ${getValue(inventoryData?.inventory?.hours)}`,
  }
  
,  
  onSubmit: () => {},
});

return (
<>

<div className="flex flex-col mb-4">
          <h1 className="text-2xl font-bold">{inventoryData?.inventory?.listing_number}</h1>
          <h1>Elevator Project</h1>

        </div>

        <div className=" mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {/* Project Name */}
        <div>
          <Label className="">Project Name</Label>
          <Input
            type="text"
            value={formik.values.project_name}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        {/* Purchase Date */}
        <div>
          <Label className="">Purchase Date</Label>
          <Input
            type="text"
            value={formik.values.purchase_date}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        {/* Start Date */}
        <div>
          <Label className="">Start Date</Label>
          <Input
            type="text"
            value={formik.values.start_date}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        {/* Completion Date */}
        <div>
          <Label className="">Completion Date</Label>
          <Input
            type="text"
            value={formik.values.completion_date}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        {/* Purchase Price */}
        <div>
          <Label className="">Purchase Price</Label>
          <Input
            type="text"
            value={formik.values.purchase_price}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        {/* Elevator Manufacturer */}
        <div>
          <Label className="">Elevator Manufacturer</Label>
          <Input
            type="text"
            value={formik.values.elevator_manufacturer}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        {/* Elevator Model */}
        <div>
          <Label className="">Elevator Model</Label>
          <Input
            type="text"
            value={formik.values.elevator_model}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        {/* Elevator Serial */}
        <div>
          <Label className="">Elevator Serial</Label>
          <Input
            type="text"
            value={formik.values.elevator_serial}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        {/* Project Status */}
        <div>
          <Label className="">Project Status</Label>
          <Input
            type="text"
            value={formik.values.project_status}
            
            className="w-full bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Project Description */}
      <div className="mt-4">
        <Label className="">Project Description</Label>
        <TextArea
          value={formik.values.project_description}
          
          className="w-full h-24 bg-gray-100 text-[#616161] border border-gray-300 rounded-md p-2 cursor-not-allowed resize-none"
        />
      </div>
    </div>




</>
  )
}

export default ViewProjectDetails