"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import {
  useGetInventoryByIdQuery,
  useGetAllCategoriesQuery,
  useGetSubCategoriesMutation,
  useEditInventoryMutation,
  useGetAllTimelineQuery
} from "@/store/services/api";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import Shipment from "./Shipment";
import Reconditioning from "./Reconditioning";
import Timeline from "./CustomizedTimeline";
import { QRCodeCanvas } from "qrcode.react";
import MuiDatePicker from "@/components/CustomDatePicker";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import * as Yup from 'yup';
import CustomizedTimeline from "./CustomizedTimeline";
import { FiLock } from "react-icons/fi";
import ButtonLoader from "@/components/ButtonLoader";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CryptoJS from 'crypto-js';

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

const SECRET_KEY = 'my_secret_key_123'; 
const EditInventoryForm = () => {
  const { id } = useParams();
  const router = useRouter()
  const searchParams = useSearchParams();
  const { data: inventoryData, error, isLoading, refetch } = useGetInventoryByIdQuery(id);
  const { data: categories, isLoading: loadingCategories } = useGetAllCategoriesQuery('');
  const [fetchSubCategories] = useGetSubCategoriesMutation();
  const [editInventory] = useEditInventoryMutation()
  const tabFromUrl = searchParams.get('tab'); // This will be "reconditioning" if passed

  const [activeTab, setActiveTab] = useState("details");
  const investmentAmount = inventoryData?.profit_data?.total_investment
  const sellingPrice = inventoryData?.inventory?.selling_price
  const profitAmount = inventoryData?.profit_data?.profit
  const profitPercentage = inventoryData?.profit_data?.profit_percentage
  const qrRef = useRef<HTMLDivElement>(null);

  // Encrypt the ID using AES
let safeId = '';
  if (typeof id === 'string') {
    safeId = id;
  } else if (Array.isArray(id)) {
    safeId = id[0]; // use first item
  } else {
    return null; // or render an error
  }

  // ✅ Encrypt ID safely
  const encryptedId = CryptoJS.AES.encrypt(safeId, SECRET_KEY).toString();
  const qrUrl = `https://fgs-theta.vercel.app/inventory/${encodeURIComponent(encryptedId)}`;

  const handleDownloadPDF = async () => {
    if (!qrRef.current) return;

    const canvas = await html2canvas(qrRef.current);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
    });

    const pageWidth = 148;
    const pageHeight = 210;
    const qrSize = 76;
    const x = (pageWidth - qrSize) / 2;
    const y = (pageHeight - qrSize) / 2;

    pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);
    pdf.save('qr-code.pdf');
  };


  // Update tab based on URL
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Remove 'tab' param from URL
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete('tab');

    const newUrl = `${window.location.pathname}?${current.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

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
  // Custom handlers for dimension fields
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    const filteredValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = filteredValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if more than one decimal point
    }
    
    // Only allow non-negative numbers
    const numValue = parseFloat(filteredValue);
    if (filteredValue === '' || (numValue >= 0)) {
      formik.setFieldValue('length', filteredValue);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    const filteredValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = filteredValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if more than one decimal point
    }
    
    // Only allow non-negative numbers
    const numValue = parseFloat(filteredValue);
    if (filteredValue === '' || (numValue >= 0)) {
      formik.setFieldValue('height', filteredValue);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    const filteredValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = filteredValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if more than one decimal point
    }
    
    // Only allow non-negative numbers
    const numValue = parseFloat(filteredValue);
    if (filteredValue === '' || (numValue >= 0)) {
      formik.setFieldValue('width', filteredValue);
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    const filteredValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = filteredValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if more than one decimal point
    }
    
    // Only allow non-negative numbers
    const numValue = parseFloat(filteredValue);
    if (filteredValue === '' || (numValue >= 0)) {
      formik.setFieldValue('weight', filteredValue);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    const filteredValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = filteredValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if more than one decimal point
    }
    
    // Only allow non-negative numbers
    const numValue = parseFloat(filteredValue);
    if (filteredValue === '' || (numValue >= 0)) {
      formik.setFieldValue('hours', filteredValue);
    }
  };

  const handlePricePaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    const filteredValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = filteredValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if more than one decimal point
    }
    
    // Only allow non-negative numbers
    const numValue = parseFloat(filteredValue);
    if (filteredValue === '' || (numValue >= 0)) {
      formik.setFieldValue('price_paid', filteredValue);
    }
  };

  const handleSerialNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only alphanumeric characters and hyphens
    const filteredValue = value.replace(/[^a-zA-Z0-9-]/g, '');
    formik.setFieldValue('serial_no', filteredValue);
  };

  const validationSchema = Yup.object().shape({
    category_id: Yup.string().required('Category is required'),
    // subcategory_id: Yup.string().required('Subcategory is required'),

    year: Yup.number()
      .required('Year is required')
      .max(9999, 'Maximum 4 digits allowed')
      .typeError('Year must be a number')
      .max(currentYear, `Year cannot be greater than ${currentYear}`),

    make: Yup.string()
      .required('Make is required')
      // .max(9999, 'Maximum 4 digits allowed')
      // .typeError('Year must be a number')
      // .max(currentYear, `Year cannot be greater than ${currentYear}`)
    ,
    model: Yup.string().required('Model is required'),
    serial_no: Yup.string()
      .required('Serial No is required')
      .matches(/^[a-zA-Z0-9-]+$/, 'Serial number can only contain letters, numbers, and hyphens'),
    length: Yup.number()
      .typeError('Length must be a number')
      .min(0, 'Length cannot be negative')
      .required('Length is required'),
    height: Yup.number()
      .typeError('Height must be a number')
      .min(0, 'Height cannot be negative')
      .required('Height is required'),
    width: Yup.number()
      .typeError('Width must be a number')
      .min(0, 'Width cannot be negative')
      .required('Width is required'),
    weight: Yup.number()
      .typeError('Weight must be a number')
      .min(0, 'Weight cannot be negative')
      .required('Weight is required'),
    hours: Yup.number()
      .typeError('Hours must be a number')
      .min(0, 'Hours cannot be negative')
      .required('Hours are required'),
    price_paid: Yup.number()
      .typeError('Price paid must be a number')
      .min(0, 'Price paid cannot be negative')
      .required('Price paid is required'),
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
        setImages([]);
        // setIsEditing(false)
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


  const fields = [
    { name: "make", label: "Make" },
    { name: "model", label: "Model" },
    { name: "serial_no", label: "Serial No" },
    { name: "length", label: "Length (feet)" },
    { name: "height", label: "Height (feet)" },
    { name: "width", label: "Width (feet)" },
    { name: "weight", label: "Weight" },
    { name: "hours", label: "Hours" },
    { name: "price_paid", label: "Price Paid" },
  ];

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


        // if (errorResponse?.data?.message) {
        //   const message = errorResponse.data.message;

        //   if (typeof message === 'string') {
        //     toast.error(message);
        //   } else if (typeof message === 'object') {
        //     const combined = Object.values(message).join(', ');
        //     toast.error(combined);
        //   }
        // }
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
      const investmentAmount = 1000
      const sellingPrice = 100
      const profitAmount = 10
      const profitPercentage = 5

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
  if (isLoading || loadingCategories) return <>
    <div className="py-6 flex items-center justify-center h-[80vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  </>;
  if (error) return <p>Error fetching inventory</p>;


  return (
    <div className=" rounded-md">
      <div className="hidden md:block">

        <div className="flex justify-between bg-white rounded shadow-md p-3 items-center">
          <div>
            <h1 className="text-2xl font-bold">{inventoryData?.inventory?.listing_number}  </h1>
            <p className="text-gray-600">Inventory</p>
            <div className="flex gap-2 mt-2">
              <button
                className={`border border-[#D184281A] text-[13px] font-family py-2 px-4 font-semibold rounded transition-all duration-300
                ${activeTab === "details" ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                onClick={() => handleTabChange("details")}
              >
                Details
              </button>
              <button
                className={`border border-[#D184281A] text-[13px] font-family py-2 px-4 font-semibold rounded transition-all duration-300
                ${activeTab === "shipment" ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                onClick={() => handleTabChange("shipment")}
              >
                Shipments
              </button>
              <button
                className={`border border-[#D184281A] text-[13px] font-family py-2 px-4 font-semibold rounded transition-all duration-300
                ${activeTab === "reconditioning" ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                onClick={() => handleTabChange("reconditioning")}
              >
                Reconditioning
              </button>
            </div>
          </div>
          {/* <div className="flex flex-col items-cetner">
            <QRCodeCanvas value={`https://fgs-theta.vercel.app/${id}`} size={76} />
            <h1 className="text-[#818181] text-[9.5px] font-normal font-family text-center mt-1">QR-Code</h1>
          </div> */}

   <div className="flex flex-col items-center">
      <div ref={qrRef}>
       <QRCodeCanvas value={qrUrl} size={76} />
      </div>
      <h1
        onClick={handleDownloadPDF}
        className="text-[#818181] text-[9.5px] font-normal font-family text-center mt-1 cursor-pointer hover:underline"
      >
        QR-Code
      </h1>
    </div>
        </div>
      </div>

      <div className="block md:hidden">

        <div className=" bg-white rounded shadow-md p-3 items-center">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{inventoryData?.inventory?.listing_number}  </h1>
                <p className="text-gray-600">Inventory</p>
              </div>
              <div className="flex flex-col items-cetner">
                <QRCodeCanvas value={`https://fgs-theta.vercel.app/inventory/${id}`} size={76} />
                <h1 className="text-[#818181] text-[9.5px] font-normal font-family text-center mt-1">QR-Code</h1>
              </div>
            </div>

          </div>
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


                    {/* <Button
                      type="submit"
                      variant="primary"
                      className='font-semibold'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <ButtonLoader /> : "Update"}
                    </Button> */}
                  </div>
                )}
                {/* <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="primary"
                  className='font-semibold'
                  disabled={sellingPrice !== null}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button> */}


              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">

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
                <Label className="">Subcategory</Label>
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
              {/* {["make", "model", "serial_no", "length", "height", "width", "weight", "hours", "price_paid"].map((field) => (
                <div key={field}>
                  <Label className="capitalize ">{field.replace("_", " ")} <span className="text-red-600">*</span></Label>
                  <input
                    type="text"
                    name={field}
                    value={formik.values[field as keyof typeof formik.values]}
                    onChange={formik.handleChange}
                    disabled={!isEditing}
                    // maxLength={["make"].includes(field) ? 4 : undefined}
                    onBlur={formik.handleBlur}
                    className="h-9 w-full rounded-sm border appearance-none px-4 py-1 text-sm shadow-theme-xs text-black placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
                  />
                  {formik.touched[field as keyof typeof formik.values] && formik.errors[field as keyof typeof formik.errors] && (
                    <p className="text-red-500">{formik.errors[field as keyof typeof formik.errors]}</p>
                  )}
                </div>
              ))} */}
              {fields.map(({ name, label }) => (
                <div key={name}>
                  <Label className="capitalize">
                    {label} <span className="text-red-600">*</span>
                  </Label>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name={name}
                      value={formik.values[name as keyof typeof formik.values] || ""}
                      onChange={(e) => {
                        switch (name) {
                          case 'length':
                            handleLengthChange(e);
                            break;
                          case 'height':
                            handleHeightChange(e);
                            break;
                          case 'width':
                            handleWidthChange(e);
                            break;
                          case 'weight':
                            handleWeightChange(e);
                            break;
                          case 'hours':
                            handleHoursChange(e);
                            break;
                          case 'price_paid':
                            handlePricePaidChange(e);
                            break;
                          case 'serial_no':
                            handleSerialNoChange(e);
                            break;
                          default:
                            formik.handleChange(e);
                        }
                      }}
                      disabled={!isEditing}
                      onBlur={formik.handleBlur}
                      className="h-9 w-full rounded-sm border appearance-none px-4 py-1 text-sm shadow-theme-xs text-black placeholder:text-gray-400 focus:outline-hidden focus:ring-1 pr-10"
                    />
                    {["length", "height", "width"].includes(name) && (
        <span className="absolute right-3 text-sm text-gray-600">feet</span>
      )}
                  </div>

                  {formik.touched[name as keyof typeof formik.values] &&
                    formik.errors[name as keyof typeof formik.errors] && (
                      <p className="text-red-500 text-sm">
                        {formik.errors[name as keyof typeof formik.errors]}
                      </p>
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
                  disableFuture={true}
                // disabled={sellingPrice !== null}

                />
                {formik.touched.date_purchased && formik.errors.date_purchased && (
                  <p className="text-red-500">{formik.errors.date_purchased}</p>
                )}
              </div>
            </div>
            {sellingPrice !== null && (<>

              <h1 className="text-[#414141] text-[18px] font-family font-medium mt-6 flex items-center gap-1">Final Cost & Profit <FiLock /></h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-4">
                <div>
                  <Label>Investment Amount</Label>
                  <Input
                    type="text"
                    value={investmentAmount}  // Replace with your actual value source
                    disabled={true}
                    className="bg-gray-100"  // Optional: Add a different background to indicate it's read-only
                  />
                </div>

                <div>
                  <Label>Selling Price</Label>
                  <Input
                    type="text"
                    value={sellingPrice}  // Replace with your actual value source
                    disabled={true}
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Profit Amount (Auto-calculated)</Label>
                  <Input
                    type="text"
                    value={profitAmount}  // Replace with your calculated value
                    disabled={true}
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Profit Percentage (Auto-calculated)</Label>
                  <Input
                    type="text"
                    value={`${profitPercentage}%`}  // Replace with your calculated value
                    disabled={true}
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </>)}





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
                            onClick={() => window.open(file.url)}
                            src={fileTypeIcon}
                            alt={`Existing File ${index}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img
                            onClick={() => window.open(file.url)}

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


                {images.map((img, index) => {
                  const isImage = img.type.startsWith('image/');
                  const previewSrc = isImage ? URL.createObjectURL(img) : getFileTypeIcon(img.name);
                  const fileName = img.name;

                  return (


                    <>
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
                    </>

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

        </>


      }

      {activeTab === "shipment" && <Shipment />}
      {activeTab === "reconditioning" && <Reconditioning />}

    </div>
  );
};

export default EditInventoryForm;