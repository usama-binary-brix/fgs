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

const EditInventoryForm = () => {
  const { id } = useParams();
  const { data: inventoryData, error, isLoading } = useGetInventoryByIdQuery(id);
  const { data: categories, isLoading: loadingCategories } = useGetAllCategoriesQuery('');
  const [fetchSubCategories] = useGetSubCategoriesMutation();
    const [editInventory] = useEditInventoryMutation()

  const [isEditing, setIsEditing] = useState(false);
  const [subCategories, setSubCategories] = useState<{ categories: any[] }>({ categories: [] });
  const [images, setImages] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<{ id: number; url: string }[]>([]);
  const [removedExistingFiles, setRemovedExistingFiles] = useState<number[]>([]);

  const formik = useFormik({
    initialValues: {
      id:id,
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
        id:id,
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
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">I-{id}</h1>
          <p className="text-gray-600">Inventory</p>
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FaEdit /> {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={formik.handleSubmit}>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-600">Category *</label>
            <select
              name="category_id"
              value={formik.values.category_id}
              onChange={formik.handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select</option>
              {categories?.categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Subcategory *</label>
            <select
              name="subcategory_id"
              value={formik.values.subcategory_id}
              onChange={formik.handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select</option>
              {subCategories?.categories?.map((sub: any) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Year *</label>
            <input
              type="text"
              name="year"
              value={formik.values.year}
              onChange={formik.handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded-md"
            />
          </div>
          {["make", "model", "serial_no", "length", "height", "width", "weight", "hours", "price_paid"].map((field) => (
            <div key={field}>
              <label className="block text-gray-600 capitalize">{field.replace("_", " ")} *</label>
              <input
                type="text"
                name={field}
                value={formik.values[field as keyof typeof formik.values]}
                onChange={formik.handleChange}
                disabled={!isEditing}
                className="w-full border p-2 rounded-md"
              />
            </div>
          ))}
          <div>
            <label className="block text-gray-600">Date Purchased *</label>
            <input
              type="date"
              name="date_purchased"
              value={formik.values.date_purchased}
              onChange={formik.handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded-md"
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
    </div>
  );
};

export default EditInventoryForm;