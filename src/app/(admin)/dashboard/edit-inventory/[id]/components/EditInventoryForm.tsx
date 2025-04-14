"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import MuiDatePicker from "@/components/CustomDatePicker";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import * as Yup from 'yup';

type ErrorResponse = {
  data: {
    error: Record<string, string>; // `error` contains field names as keys and error messages as values
  };
};

type SUbCategoriesErrorResponse = {
  data: {
    message: string | Record<string, string>;
  };
};


const EditInventoryForm = () => {
  const { id } = useParams();
  const router = useRouter()
  const { data: inventoryData, error, isLoading, refetch } = useGetInventoryByIdQuery(id);
  const { data: categories, isLoading: loadingCategories } = useGetAllCategoriesQuery('');
  const [fetchSubCategories] = useGetSubCategoriesMutation();
  const [editInventory] = useEditInventoryMutation()
  const [activeTab, setActiveTab] = useState("details");

  const [isEditing, setIsEditing] = useState(false);
  const [subCategories, setSubCategories] = useState<{ categories: any[] }>({ categories: [] });
  const [images, setImages] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<{ id: number; url: string }[]>([]);
  const [removedExistingFiles, setRemovedExistingFiles] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    refetch()
  }, [id])
  const validationSchema = Yup.object().shape({
    category_id: Yup.string().required('Category is required'),
    // subcategory_id: Yup.string().required('Subcategory is required'),

    year: Yup.number()
      .required('Year is required')
      .max(9999, 'Maximum 4 digits allowed')
      .typeError('Year must be a number')
      .max(currentYear, `Year cannot be greater than ${currentYear}`),

    make: Yup.number()
      .required('Make is required')
      .max(9999, 'Maximum 4 digits allowed')
      .typeError('Year must be a number')
      .max(currentYear, `Year cannot be greater than ${currentYear}`)
    ,
    model: Yup.string().required('Model is required'),
    serial_no: Yup.string().required('Serial No is required'),
    length: Yup.string().required('Length is required'),
    height: Yup.string().required('Height is required'),
    width: Yup.string().required('Width is required'),
    weight: Yup.string().required('Weight is required'),
    hours: Yup.string().required('Hours are required'),
    price_paid: Yup.string().required('Price paid is required'),
    date_purchased: Yup.date().required('Purchase date is required').typeError('Invalid date format'),

  });
  const formik = useFormik({
    initialValues: {
      inventory_id: id,
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
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();



      // Append all other form values
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      existingFiles.forEach((file) => {
        if (!removedExistingFiles.includes(file.id)) {
          formData.append("existing_images[]", file.url);
        }
      });

      // Append new files
      images.forEach((image) => {
        formData.append("files[]", image);
      });

      try {
        setIsSubmitting(true)
        await editInventory(formData).unwrap();
        toast.success("Inventory updated successfully!");
        router.push('/dashboard/inventory')
      } catch (error) {


        const errorResponse = error as ErrorResponse;


        if (errorResponse?.data?.error) {
          Object.values(errorResponse.data.error).forEach((errorMessage) => {
            if (Array.isArray(errorMessage)) {
              errorMessage.forEach((msg) => toast.error(msg)); // Handle array errors
            } else {
              toast.error(errorMessage); // Handle single string errors
            }
          });
        }
        console.error("Error submitting form:", error);
      }
      finally {
        setIsSubmitting(false)
      }
    },

  });

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    formik.setFieldValue("category_id", categoryId);
    formik.setFieldValue("subcategory_id", ""); // Reset subcategory when category changes
    setSubCategories({ categories: [] }); // Clear existing subcategories

    if (categoryId) {
      try {
        const response = await fetchSubCategories(categoryId).unwrap();
        setSubCategories(response);

        // If no subcategories available, show a toast
        if (!response.categories || response.categories.length === 0) {
          toast.info("No subcategories available for this category");
        }
      } catch (error) {
        const errorResponse = error as SUbCategoriesErrorResponse;


        if (errorResponse?.data?.message) {
          const message = errorResponse.data.message;

          if (typeof message === 'string') {
            toast.error(message);
          } else if (typeof message === 'object') {
            const combined = Object.values(message).join(', ');
            toast.error(combined);
          }
        }
      }
    }
  };


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
        inventory_id: id,
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



  const getFileTypeIcon = (fileUrl: string): string => {
    if (!fileUrl) return '/images/filesicon/docss.png';
console.log(fileUrl, 'file url')
    const lowerCaseFileUrl = fileUrl.toLowerCase();

    if (lowerCaseFileUrl.endsWith('.pdf')) {
      return '/images/filesicon/pdff.png';
    }
    if (lowerCaseFileUrl.endsWith('.doc') || lowerCaseFileUrl.endsWith('.docx')) {
      return '/images/filesicon/docss.png';
    }
    if (lowerCaseFileUrl.endsWith('.xls') || lowerCaseFileUrl.endsWith('.xlsx')) {
      return '/images/filesicon/xlsx.png';
    }
    if (lowerCaseFileUrl.match(/\.(jpg|jpeg|png|gif|svg|webp|JPG|jfif)$/)) {
      return fileUrl;
    }
    return '/images/filesicon/docss.png';
  };

  const getFileNameFromUrl = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch {
      return url.split('/').pop() || 'file';
    }
  };



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
          <h1 className="text-2xl font-bold">{inventoryData?.inventory?.listing_number}  </h1>
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


      {
        activeTab === "details" &&
        <>
          <form onSubmit={formik.handleSubmit}>

            <div className="flex justify-between items-center mt-3">
              <h1 className="text-[#000] text-[18px] font-family font-medium">Details</h1>

              <div className="flex gap-2 items-center">
                {isEditing && (
                  <div className="col-span-3 flex justify-end">


                    <Button
                      type="submit"
                      variant="primary"
                      className='font-semibold'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                  </div>
                )}
                <Button
                  onClick={() => setIsEditing(!isEditing)}

                  variant="primary"
                  className='font-semibold'

                >
                  {/* <FaEdit /> */}
                  {isEditing ? "Cancel" : "Edit"}
                </Button>


              </div>
            </div>
            {/* <form onSubmit={formik.handleSubmit}> */}

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <Label className="">Category <span className="text-red-600">*</span></Label>
                <select
                  name="category_id"
                  value={formik.values.category_id}
                  onChange={handleCategoryChange}
                  disabled={!isEditing}
                  className="w-full h-9 p-2  border border-gray-300 rounded-sm text-sm"
                >
                  <option value="">Select</option>
                  {categories?.categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="">Subcategory <span className="text-red-600">*</span></Label>
                <select
                  name="subcategory_id"
                  value={formik.values.subcategory_id}
                  onChange={formik.handleChange}
                  disabled={!isEditing}
                  className="w-full h-9 p-2  border border-gray-300 rounded-sm text-sm"
                >
                  <option value="">Select</option>
                  {subCategories?.categories?.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="">Year <span className="text-red-600">*</span></Label>
                <Input
                  type="text"
                  name="year"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  disabled={!isEditing}
                  className=""
                  maxLength={4}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.year && formik.errors.year && (
                  <p className="text-red-500">{formik.errors.year}</p>
                )}
              </div>
              {["make", "model", "serial_no", "length", "height", "width", "weight", "hours", "price_paid"].map((field) => (
                <div key={field}>
                  <Label className="capitalize ">{field.replace("_", " ")} <span className="text-red-600">*</span></Label>
                  <input
                    type="text"
                    name={field}
                    value={formik.values[field as keyof typeof formik.values]}
                    onChange={formik.handleChange}
                    disabled={!isEditing}
                    maxLength={["make"].includes(field) ? 4 : undefined}
                    onBlur={formik.handleBlur}
                    className="h-9 w-full rounded-sm border appearance-none px-4 py-1 text-sm shadow-theme-xs text-gray-500 placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
                  />
                  {formik.touched[field as keyof typeof formik.values] && formik.errors[field as keyof typeof formik.errors] && (
                    <p className="text-red-500">{formik.errors[field as keyof typeof formik.errors]}</p>
                  )}
                </div>
              ))}
             <div>
  <Label>Date Purchased <span className="text-red-500">*</span></Label>
  <MuiDatePicker
    name="date_purchased"
    value={formik.values.date_purchased}
    onChange={(value: any) => {
      formik.setFieldValue("date_purchased", value);
    }}
    disableFuture={true} // This will disable all future dates
  />
  {formik.touched.date_purchased && formik.errors.date_purchased && (
    <p className="text-red-500">{formik.errors.date_purchased}</p>
  )}
</div>
            </div>
            <div className="mt-6">
              <h1 className="font-semibold">Attached Files</h1>
              <div className="flex mt-2 gap-5 items-center flex-wrap">
                {/* Existing files */}
                {existingFiles.map((file, index) => {
                  const fileTypeIcon = getFileTypeIcon(file.url);
                  const isImage = fileTypeIcon === file.url; // If the icon is the same as URL, it's an image
                  const fileName = getFileNameFromUrl(file.url);

                  return (
                    <div key={file.id} className="relative w-35">
                      <div className="h-30 rounded-lg overflow-hidden">
                        {isImage ? (
                          <img
                          onClick={()=>window.open(file.url)}
                            src={fileTypeIcon}
                            alt={`Existing File ${index}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img
                          onClick={()=>window.open(file.url)}

                            src={fileTypeIcon}
                            alt="File type icon"
                            className="w-full h-full object-contain rounded-lg bg-gray-100 p-2"
                          />
                        )}
                        {isEditing && (
                          <button
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            onClick={() => removeExistingFile(index)}
                          >
                            <RxCross2 className="text-xs" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-center mt-1 truncate w-full" title={fileName}>
                        {fileName}
                      </p>
                    </div>
                  );
                })}

                {/* Newly uploaded files */}
                {images.map((img, index) => {
                  const isImage = img.type.startsWith('image/');
                  const previewSrc = isImage ? URL.createObjectURL(img) : getFileTypeIcon(img.name);
                  const fileName = img.name;

                  return (
                    <div key={index} className="relative w-35">
                      <div className="h-30 rounded-lg overflow-hidden">
                        <img
                          src={previewSrc}
                          alt={`Uploaded preview ${index}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          onClick={() => removeImage(index)}
                        >
                          <RxCross2 className="text-xs" />
                        </button>
                      </div>
                      <p className="text-xs text-center mt-1 truncate w-full" title={fileName}>
                        {fileName}
                      </p>
                    </div>
                  );
                })}

                {isEditing && (
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer h-34 w-40 hover:bg-gray-100">
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div className="text-center p-4">
                        <p className="text-gray-700 font-semibold text-xs">Drop your files here,</p>
                        <p className="text-blue-600 underline text-xs">or browse</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

          </form>
          {/* <div>
            <h1 className="text-[#000] text-[17px] font-medium font-family mt-10 mb-5">Inventory Stages</h1>
            <div className="flex justify-center">
              <Timeline />
            </div>
          </div> */}
        </>


      }

      {activeTab === "shipment" && <Shipment />}
      {activeTab === "reconditioning" && <Reconditioning />}

    </div>
  );
};

export default EditInventoryForm;