// "use client";
// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { FaEdit } from "react-icons/fa";

// const EditInventoryForm = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);

//   return (
//     <div className="p-6 bg-white shadow-md rounded-md">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">I-{id}</h1>
//           <p className="text-gray-600">Inventory</p>
//         </div>
//         <button 
//           className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
//           onClick={() => setIsEditing(!isEditing)}
//         >
//           <FaEdit /> Edit
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="mt-4 flex gap-2">
//         {['Details', 'Shipment', 'Reconditioning'].map((tab) => (
//           <button key={tab} className="bg-yellow-500 text-white px-4 py-2 rounded-md">{tab}</button>
//         ))}
//       </div>

//       {/* Details Section */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold">Details</h2>
//         <form onSubmit={formik.handleSubmit} autoComplete='off'>
//                     <Grid container spacing={2}>
//                         <Grid item xs={6} md={4}>
//                             <label className='text-[12.5px] text-[#818181] font-normal font-family'>Category 

//             <span className='text-red-500'> *</span>

//                             </label>
//                             <select name="category_id" style={selectStyle} value={formik.values.category_id} onChange={handleCategoryChange}>
//                                 <option value="">Select</option>
//                                 {categories?.categories?.map((category: any) => (
//                                     <option key={category.id} value={category.id}>{category.name}</option>
//                                 ))}
//                             </select>
//                         </Grid>

//                         <Grid item xs={6} md={4}>
//                             <label className='text-[12.5px] text-[#818181] font-normal font-family'>SubCategory 
//                             <span className='text-red-500'> *</span>


//                             </label>
//                             <select name="subcategory_id" style={inputStyle} value={formik.values.subcategory_id} onChange={formik.handleChange}>
//                                 <option value="">Select</option>
//                                 {subCategories?.categories?.map((sub: any) => (
//                                     <option key={sub.id} value={sub.id}>{sub.name}</option>
//                                 ))}
//                             </select>
//                         </Grid>

//                         {["year", "make", "model", "serial_no", "length", "height", "width", "weight", "hours", "price_paid", "condition", "description", "location"].map((field) => (
//                             <Grid item xs={6} md={4} key={field}>
//  <label className='capitalize text-[12.5px] text-[#818181] font-normal font-family'>
//             {field.replace("_", " ")} 
//             <span className='text-red-500'> *</span>
//         </label>                                <input
//                                     type="text"
//                                     name={field}
//                                     style={inputStyle}
//                                     value={formik.values[field as keyof typeof formik.values]} // ✅ Fix
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     className='border-1 border-[#E8E8E8]'
//                                 />
//                                 {formik.touched[field as keyof typeof formik.values] && formik.errors[field as keyof typeof formik.errors] && (
//                                     <p className="text-red-500">{formik.errors[field as keyof typeof formik.errors]}</p>
//                                 )}
//                             </Grid>
//                         ))}

//                         <Grid item xs={6} md={4}>
//                             <label className='text-[12.5px] text-[#818181] font-normal font-family'>Purchase Date *</label>
//                             <input
//                                 type="date"
//                                 name="date_purchased"
//                                 style={inputStyle}
//                                 value={formik.values.date_purchased}
//                                 onChange={formik.handleChange}
//                             />
//                             {formik.errors.date_purchased && <p className="text-red-500">{formik.errors.date_purchased}</p>}
//                         </Grid>


//                         <Grid xs={12} md={12} mt={2} ml={2}>
//                             <div>
//                                 <h1 className="text-sm text-black font-normal text-[12.5px] font-family">Attach Files</h1>
//                                 <p className="text-custom-lightGray text-[10px] font-family font-normal">Only PDF, JPG & PNG formats are allowed</p>
//                             </div>
//                             <div className="flex items-center gap-2 mt-3">
//                                 <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer h-[103px] px-2 hover:bg-gray-100">
//                                     <input
//                                         type="file"
//                                         accept="image/png, image/jpeg, application/pdf"
//                                         multiple
//                                         className="hidden"
//                                         onChange={handleImageUpload}
//                                     />
//                                     <div className="text-center">
//                                         <p className="text-gray-700 font-semibold text-xs">Drop your image here,</p>
//                                         <p className="text-blue-600 underline text-xs">or browse</p>
//                                     </div>
//                                 </label>

//                                 {images.length > 0 && (
//                                     <div className="flex gap-4 mt-0 flex-wrap">
//                                         {images.map((img, index) => (
//                                             <div key={index} className="relative">
//                                                 <img
//                                                     src={URL.createObjectURL(img)}
//                                                     alt={`Uploaded preview ${index}`}
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                                 <button
//                                                     className="absolute top-1 right-1 bg-red-500 text-white rounded-lg p-1"
//                                                     onClick={() => removeImage(index)}
//                                                 >
//                                                     <RxCross2/>
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         </Grid>
                       
//                     </Grid>
//                 </form>
//       </div>

//       {/* Final Cost & Profit */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold">Final Cost & Profit</h2>
//         <div className="grid grid-cols-4 gap-4 mt-4">
//           {['Investment Amount', 'Selling Price', 'Profit Amount (Auto-calculated)', 'Profit Percentage (Auto-calculated)'].map((field) => (
//             <div key={field}>
//               <label className="block text-gray-600">{field} *</label>
//               <input
//                 type="text"
//                 disabled={!isEditing}
//                 className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-xl font-semibold">Attached Files</h2>
//         <div className="mt-4 flex gap-2">
//           {Array(6).fill(0).map((_, i) => (
//             <div key={i} className="w-20 h-24 bg-gray-200 rounded-md shadow-md"></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditInventoryForm;


import React from 'react'

const EditInventoryForm = () => {
  return (
    <div>EditInventoryForm</div>
  )
}

export default EditInventoryForm