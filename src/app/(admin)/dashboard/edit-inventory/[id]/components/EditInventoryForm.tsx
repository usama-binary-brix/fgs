"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import { 
  useGetInventoryByIdQuery, 
  useGetAllCategoriesQuery, 
  useGetSubCategoriesMutation 
} from "@/store/services/api";

const EditInventoryForm = () => {
  const { id } = useParams();
  const { data: inventoryData, error, isLoading } = useGetInventoryByIdQuery(id);
  const { data: categories, isLoading: loadingCategories } = useGetAllCategoriesQuery('');
  const [fetchSubCategories] = useGetSubCategoriesMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [subCategories, setSubCategories] = useState<{ categories: any[] }>({ categories: [] });

  const formik = useFormik({
    initialValues: {
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
    onSubmit: (values) => {
      console.log("Updated Data:", values);
      // TODO: Add API call to update the inventory data
    },
  });

  // Fetch Subcategories when category changes
  useEffect(() => {
    const fetchSubCategoriesData = async () => {
      if (formik.values.category_id) {
        try {
          const response = await fetchSubCategories(formik.values.category_id).unwrap();
          setSubCategories(response);
        } catch (error) {
          console.error("Failed to fetch subcategories", error);
        }
      }
    };
    fetchSubCategoriesData();
  }, [formik.values.category_id]);

  // Populate form when inventory data arrives
  useEffect(() => {
    if (inventoryData?.inventory) {
      const inv = inventoryData.inventory;
      formik.setValues({
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
    }
  }, [inventoryData]);

  if (isLoading || loadingCategories) return <p>Loading...</p>;
  if (error) return <p>Error fetching inventory</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">I-{id}</h1>
          <p className="text-gray-600">Inventory</p>
        </div>
        <button 
          className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FaEdit /> {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="mt-6 grid grid-cols-3 gap-4">
        {/* Category Dropdown */}
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

        {/* Subcategory Dropdown */}
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

        {/* Year Input */}
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

        {/* Other Fields */}
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

        {/* Date Purchased Field (Now a Date Picker) */}
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

        {/* Submit Button */}
        {isEditing && (
          <div className="col-span-3 flex justify-end">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-md">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditInventoryForm;
