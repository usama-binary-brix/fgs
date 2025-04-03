'use client'
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import { useFormik } from 'formik';
import { useParams } from 'next/navigation';
import React from 'react'

const ViewProjectDetails = () => {
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      project_name: "Project C",
      purchase_date: "02-26-2024",
      start_date: "03-15-2024",
      completion_date: "06-15-2024",
      purchase_price: "$ 2170.00",
      elevator_manufacturer: "Hoist",
      elevator_model: "C25L",
      elevator_serial: "C09701",
      project_status: "In-progress",
      project_description:
        "This project typically includes modernizing mechanical components, updating control systems, and refreshing the interior design, resulting in improved reliability, and energy efficiency.",
    },
    onSubmit: () => {}, // Dummy function to satisfy Formik
  });
  

return (
<>

<div className="flex flex-col mb-4">
          <h1 className="text-2xl font-bold">I-{id}</h1>
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