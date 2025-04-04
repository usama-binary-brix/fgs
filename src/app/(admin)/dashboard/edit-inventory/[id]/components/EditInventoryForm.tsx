"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import {
  useGetInventoryByIdQuery,
  useGetAllCategoriesQuery,
  useGetSubCategoriesMutation,
  useEditInventoryMutation
} from "@/store/services/api";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import Shipment from "./Shipment";
import Reconditioning from "./Reconditioning";
import Timeline from "./Timeline";
import { QRCodeCanvas } from "qrcode.react";

const EditInventoryForm = () => {
  const { id } = useParams();
  const { data: inventoryData, error, isLoading } = useGetInventoryByIdQuery(id);
  const { data: categories, isLoading: loadingCategories } = useGetAllCategoriesQuery('');
  const [fetchSubCategories] = useGetSubCategoriesMutation();
  const [editInventory] = useEditInventoryMutation()
  const [activeTab, setActiveTab] = useState("details");

  const [isEditing, setIsEditing] = useState(false);
  const [subCategories, setSubCategories] = useState<{ categories: any[] }>({ categories: [] });
  const [images, setImages] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<{ id: number; url: string }[]>([]);
  const [removedExistingFiles, setRemovedExistingFiles] = useState<number[]>([]);

  const formik = useFormik({
    initialValues: {
      id: id,
      category_id: "",
      subcategory_id: "",
      year: "",
      make: "",
      model: "",
      serial_no: "",
      length: "",
      height: "",
      width: "",
      weight: "",
      hours: "",
      price_paid: "",
      date_purchased: "",
    },
    onSubmit: async (values) => {
      const formData = new FormData();



      // Append all other form values
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      existingFiles.forEach((file) => {
        if (!removedExistingFiles.includes(file.id)) {
          formData.append("existing_files[]", file.url);
        }
      });

      // Append new files
      images.forEach((image) => {
        formData.append("files[]", image);
      });

      try {
        await editInventory(formData).unwrap();
        toast.success("Inventory updated successfully!");
      } catch (error) {
        toast.error("Failed to update inventory");
        console.error("Error submitting form:", error);
      }
    },

  });

  useEffect(() => {
    if (formik.values.category_id) {
      const fetchSubCategoriesData = async () => {
        try {
          const response = await fetchSubCategories(formik.values.category_id).unwrap();
          setSubCategories(response);
        } catch (error) {
          console.error("Failed to fetch subcategories", error);
        }
      };
      fetchSubCategoriesData();
    }
  }, [formik.values.category_id]);

  useEffect(() => {
    if (inventoryData?.inventory) {
      const inv = inventoryData.inventory;
      formik.setValues({
        id: id,
        category_id: inv.category_id || "",
        subcategory_id: inv.subcategory_id || "",
        year: inv.year || "",
        make: inv.make || "",
        model: inv.model || "",
        serial_no: inv.serial_no || "",
        length: inv.length || "",
        height: inv.height || "",
        width: inv.width || "",
        weight: inv.weight || "",
        hours: inv.hours || "",
        price_paid: inv.price_paid || "",
        date_purchased: inv.date_purchased || "",
      });
      if (inv.files) {
        setExistingFiles(inv.files.map((file: any) => ({ id: file.id, url: file.file })));
      }
    }
  }, [inventoryData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // const removeExistingFile = (index: number) => {
  //   setExistingFiles(existingFiles.filter((_, i) => i !== index));
  // };
  const removeExistingFile = (index: number) => {
    const fileToRemove = existingFiles[index];
    setRemovedExistingFiles([...removedExistingFiles, fileToRemove.id]);
    setExistingFiles(existingFiles.filter((_, i) => i !== index));
  };
  if (isLoading || loadingCategories) return <p>Loading...</p>;
  if (error) return <p>Error fetching inventory</p>;




  return (
    <div className=" rounded-md">
      <div className="flex justify-between bg-white rounded shadow-md p-3 items-center">
        <div>
          <h1 className="text-2xl font-bold">I-{id}</h1>
          <p className="text-gray-600">Inventory</p>
          <div className="flex gap-2 mt-2">
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
          </div>
        </div>
       <div className="flex flex-col items-cetner">
       <QRCodeCanvas value="https://yourwebsite.com" size={76} />
       <h1 className="text-[#818181] text-[9.5px] font-normal font-family text-center mt-1">QR-Code</h1>
       </div>
        {/* <button
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FaEdit /> {isEditing ? "Cancel" : "Edit"}
        </button> */}
      </div>

      <div className="flex justify-between items-center mt-3">
        <h1 className="text-[#000] text-[17px] font-family font-medium">Details</h1>
          <button
          className="bg-primary text-white px-4 py-2 rounded-sm flex items-center gap-1 text-sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FaEdit /> {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      {
        activeTab === "details" &&
        <>
        <form onSubmit={formik.handleSubmit}>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[#818181] text-[12.5px] font-normal font-family mb-1">Category <span className="text-red-600">*</span></label>
              <select
                name="category_id"
                value={formik.values.category_id}
                onChange={formik.handleChange}
                disabled={!isEditing}
                className="w-full border p-2 rounded-xs border-[#E8E8E8] text-[13px] font-medium font-family"
              >
                <option value="">Select</option>
                {categories?.categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#818181] text-[12.5px] font-normal font-family mb-1">Subcategory <span className="text-red-600">*</span></label>
              <select
                name="subcategory_id"
                value={formik.values.subcategory_id}
                onChange={formik.handleChange}
                disabled={!isEditing}
                className="w-full border p-2 rounded-xs border-[#E8E8E8] text-[13px] font-medium font-family"
              >
                <option value="">Select</option>
                {subCategories?.categories?.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#818181] text-[12.5px] font-normal font-family mb-1">Year <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                disabled={!isEditing}
                className="w-full border p-2 rounded-xs border-[#E8E8E8] text-[13px] font-medium font-family"
              />
            </div>
            {["make", "model", "serial_no", "length", "height", "width", "weight", "hours", "price_paid"].map((field) => (
              <div key={field}>
                <label className="block text-[#818181] text-[12.5px] font-normal font-family mb-1">{field.replace("_", " ")} <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  name={field}
                  value={formik.values[field as keyof typeof formik.values]}
                  onChange={formik.handleChange}
                  disabled={!isEditing}
                  className="w-full border p-2 rounded-xs border-[#E8E8E8] text-[13px] font-medium font-family"
                />
              </div>
            ))}
            <div>
              <label className="block text-[#818181] text-[12.5px] font-normal font-family mb-1">Date Purchased <span className="text-red-600">*</span></label>
              <input
                type="date"
                name="date_purchased"
                value={formik.values.date_purchased}
                onChange={formik.handleChange}
                disabled={!isEditing}
                className="w-full border p-2 rounded-xs border-[#E8E8E8] text-[13px] font-medium font-family"
              />
            </div>
          </div>
          <div className="mt-6">
            <h1 className="font-semibold">Attached Files</h1>
            <div className="flex mt-2 gap-5 items-center">
              {existingFiles.map((file, index) => (
                <div key={file.id} className="relative h-30 w-40 rounded-lg">
                  <img src={file.url} alt={`Existing File ${index}`} className="w-full h-full object-cover rounded-lg" />
                  <button className="absolute top-1 right-1 bg-red-500 text-white rounded-lg p-1" onClick={() => removeExistingFile(index)}>
                    <RxCross2 />
                  </button>
                </div>
                
              ))}

              {images.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                  {images.map((img, index) => (
                    <div key={index} className="relative h-30 w-40 rounded-lg">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Uploaded preview ${index}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-lg p-1"
                        onClick={() => removeImage(index)}
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  ))}
                </div>

                
              )}

              <div>

                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer h-30 px-2 hover:bg-gray-100">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="text-center px-6">
                    {/* <h1 className="text-sm text-black font-normal">Attach Files</h1>   */}
                    {/* <p className="text-custom-lightGray text-xs">Only PDF, JPG & PNG formats are allowed</p> */}
                    <p className="text-gray-700 font-semibold text-xs">Drop your files here,</p>
                    <p className="text-blue-600 underline text-xs">or browse</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="col-span-3 flex justify-end">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md">
                Update
              </button>
            </div>
          )}
        </form>
        <div>
          <h1 className="text-[#000] text-[17px] font-medium font-family mt-10 mb-5">Inventory Stages</h1>
          <div className="flex justify-center">
            <Timeline />
          </div>
        </div>
        </>

       
      }

      {activeTab === "shipment" && <Shipment />}
      {activeTab === "reconditioning" && <Reconditioning />}

    </div>
  );
};

export default EditInventoryForm;