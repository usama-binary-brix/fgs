import Button from '@/components/ui/button/Button';
import React, { useEffect, useState } from 'react'
import { FiChevronDown, FiPlusCircle } from 'react-icons/fi';
import CreateShipmentModal from './CreateShipmentModal';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFormik } from 'formik';
import { FaLock } from 'react-icons/fa';
import AddLeadInput from '../../../leads/components/input/AddLeadInput';
import Label from '@/components/form/Label';
import MuiDatePicker from '@/components/CustomDatePicker';
import { Pagination, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeader } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { useParams, useRouter } from 'next/navigation';
import { useAddNewShipmentMutation, useDeleteShipmentMutation, useGetAllShipmentsQuery } from '@/store/services/api';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../../accounts/components/AccountsModal';
import RadioButton from '../../../leads/components/radiobutton/RadioButton';
import ShipmentQuotesTable from './shipmentQuotes/ShipmentQuotesTable';

// Shipment Provider 
const shipmentProvider = [
  { value: "CJ Shipping Experts" },
  { value: "CJ Shipping Experts" },
  { value: "CJ Shipping Experts" },
  { value: "CJ Shipping Experts" },
];

// Address 
const addressValues = [
  { value: "Warehouse A" },
  { value: "Warehouse B" },
  { value: "Warehouse C" },
  { value: "Warehouse D" },
];

const warehouseOptions = ["Warehouse A", "Warehouse B", "Warehouse C"];


interface Lead {
  companyName: string;
  quoteAmount: string;
  estimateTimeOfArrival: string;
  contactInformation: string;
}

const shipmentQuotesData = [
  {
    companeName: "GLC040",
    quoteAmount: "$500",
    estimateTimeOfArrival: "---",
    contactInformation: "Bob, 456 Oak Ave, Rivertown, TX",
  },
]

const Shipment = () => {
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams()
  const [isEditMode, setIsEditMode] = useState(false)
  const [activeBoundTab, setActiveBoundTab] = useState("inbound");
  const [createShipmentModal, setCreateShipmentModal] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    shipmentProvider: false,
    pickupWareHouse: false,
  });

  const { data, error, isLoading, refetch } = useGetAllShipmentsQuery({
    id,
    shipmentType: activeBoundTab,
  });

 

  useEffect(() => {
    refetch()
  }, [activeBoundTab])

  const shipments = data?.shipment || [];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(null);
  const [updateShipment] = useAddNewShipmentMutation();

  const router = useRouter()

  const toggleDropdown = (id: string) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
      setActiveRowId(null);
    } else {
      setOpenDropdown(id);
      setActiveRowId(id);
    }
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const formik = useFormik({
    initialValues: {
      inventoryId: id || '',
      year: '',
      make: '',
      model: '',
      serialNo: '',
      length: '',
      height: '',
      width: '',
      weight: '',
      shipment: '',
      shipmentProvider: "",
      selectAddress: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      destinationAddress: "",
      destinationCountry: "",
      destinationState: "",
      destinationCity: "",
      destinationZipCode: "",
      expectedArrivalDate: "",
      shippingNotes: "",
      pickupWareHouse: "",


    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {

          inventory_id: id, // Send inventory ID instead of full details
          shipment: values.shipment,
          // pickup_shipment_provider: values.shipmentProvider,
          warehouse_name: values.pickupWareHouse,
          pickup_address: values.address,
          pickup_country: values.country,
          pickup_state: values.state,
          pickup_city: values.city,
          pickup_zip_code: values.zipCode,
          destination_address: values.destinationAddress,
          destination_country: values.destinationCountry,

          destination_state: values.destinationState,
          destination_city: values.destinationCity,
          destination_zip_code: values.destinationZipCode,

          expected_arrival_date: values.expectedArrivalDate,
          shipment_note: values.shippingNotes,
        };



        const response = await updateShipment({
          shipment_id: editingShipmentId,
          ...payload
        }).unwrap();
        toast.success(response.message || 'Shipment updated successfully');
        setEditingShipmentId(null);
        setIsEditMode(false);;
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
        } else {
          toast.error('Failed to create shipment');
        }
      }
    },
    enableReinitialize: false,
  });
  const populateFormikValues = (shipment: any) => {
    formik.setValues({
      inventoryId: shipment.inventory.id || '',
      shipment: shipment.shipment || '',
      year: shipment.inventory.year || '',
      make: shipment.inventory.make || '',
      model: shipment.inventory.model || '',
      serialNo: shipment.inventory.serial_no || '',
      length: shipment.inventory.length || '',
      height: shipment.inventory.height || '',
      width: shipment.inventory.width || '',
      weight: shipment.inventory.weight || '',
      shipmentProvider: shipment.pickup_shipment_provider || "",
      selectAddress: shipment.pickup_warehouse_name || "",
      pickupWareHouse: shipment.warehouse_name || "", // this was missing
      address: shipment.pickup_address || "",
      country: shipment.pickup_country || "",
      state: shipment.pickup_state || "",
      city: shipment.pickup_city || "",
      zipCode: shipment.pickup_zip_code || "",
      destinationAddress: shipment.destination_address || "",
      destinationCountry: shipment.destination_country || "",
      destinationState: shipment.destination_state || "",
      destinationCity: shipment.destination_city || "",
      destinationZipCode: shipment.destination_zip_code || "",
      expectedArrivalDate: shipment.expected_arrival_date || "",
      shippingNotes: shipment.shipment_note || "",
    });
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<any>(null);

  const handleOpenDeleteModal = (Id: any) => {
    setSelectedShipmentId(Id);
    // setSelectedTaskName(taskName);
    setIsDeleteModalOpen(true);
  };

  const handleCreateShipmentOpenModal = () => {
    setCreateShipmentModal(true);
  }

  const handleCreateShipmentCloseModal = () => {
    setCreateShipmentModal(false);
  }
  const [deleteShipment, { isLoading: isDeleting }] = useDeleteShipmentMutation();

  const handleDeleteShipment = async () => {
    try {
      await deleteShipment(selectedShipmentId).unwrap();
      toast.success('Shipment deleted successfully!');

    } catch (error) {
      toast.error('Failed to delete Task!');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedShipmentId(null);
    }
  };



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading shipments</div>;

  return (
    <>
      <div className="row">
        <div className="grid-cols-1">
          <div className="flex gap-2 mt-5 mb-5">
            <button
              className={`border border-[#D184281A] text-[13px] opacity-50 font-family py-2 px-4 font-semibold rounded transition-all duration-300
                ${activeTab === "details" ? 'bg-[#D18428] opacity-100 text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`border border-[#D184281A] text-[13px] opacity-50 font-family py-2 px-4 font-semibold rounded transition-all duration-300
                ${activeTab === "shipmentQuotes" ? 'bg-[#D18428] opacity-100 text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
              onClick={() => setActiveTab("shipmentQuotes")}
            >
              Shipments Quotes
            </button>
          </div>

          {activeTab === "details" && (
            <>
              <div className="mt-5 flex items-center justify-between">
                <h2 className="text-[17px] font-medium font-family text-[#000]">All Shipments</h2>
                <Button onClick={handleCreateShipmentOpenModal} size='sm'>Create Shipment</Button>
              </div>

              <div className="flex gap-2 mt-5 mb-5">
                <button
                  className={`border border-[#D184281A] text-[13px] opacity-50 font-family py-2 px-4 font-semibold rounded transition-all duration-300
                    ${activeBoundTab === "inbound" ? 'bg-[#D18428] opacity-100 text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                  onClick={() => setActiveBoundTab("inbound")}
                >
                  Inbound
                </button>
                <button
                  className={`border border-[#D184281A] text-[13px] opacity-50 font-family py-2 px-4 font-semibold rounded transition-all duration-300
                    ${activeBoundTab === "outbound" ? 'bg-[#D18428] opacity-100 text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
                  onClick={() => setActiveBoundTab("outbound")}
                >
                  Outbound
                </button>
              </div>

              {activeBoundTab === "inbound" && (
                <>
                  {shipments.length === 0 ? (
                    <div className='bg-[#F7F7F7] p-3 gap-2 mt-5 rounded-lg flex justify-center flex-col items-center cursor-pointer' onClick={handleCreateShipmentOpenModal}>
                      <FiPlusCircle size={60} strokeWidth={1.5} color='#616161' />
                      <p className='text-[16px] font-normal font-family text-[#616161]'>No Shipments Found! To create one click the button</p>
                    </div>
                  ) : (
                    <div>
                      {shipments.map((shipment: any) => (
                        <Accordion key={shipment.id} onChange={() => populateFormikValues(shipment)}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <div className='flex items-center justify-between w-full'>
                              <p className='text-[17px] text-[#000] font-medium font-family'>
                                {shipment.shipment === 'inbound' ? 'Inbound' : 'Outbound'} Shipment # {shipment.id}
                              </p>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <form onSubmit={formik.handleSubmit} >
                                <div className="container">
                                  <div className="row mx-3">
                                    {isEditMode && (
                                      <>

                                        <div className="p-4">
                                          <label className='text-[12.5px] font-normal font-family text-[#818181] mb-4'>
                                            Shipment <span className='text-red-500'>*</span>
                                          </label>
                                          <div className='flex gap-5 mt-1'>
                                            <div className='flex gap-2'>
                                              <RadioButton
                                                isSelected={formik.values.shipment === 'inbound'}
                                                onSelect={() => formik.setFieldValue('shipment', 'inbound')}
                                              />
                                              <span className='text-[13px] text-[#414141] font-medium font-family'>InBound</span>
                                            </div>
                                            <div className='flex gap-2'>
                                              <RadioButton
                                                isSelected={formik.values.shipment === 'outbound'}
                                                onSelect={() => formik.setFieldValue('shipment', 'outbound')}
                                              />
                                              <span className='text-[13px] text-[#414141] font-medium font-family'>OutBound</span>
                                            </div>
                                          </div>
                                        </div>




                                      </>
                                    )}
                                    <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4'>
                                      {/* Inventory Details */}
                                      <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                                        <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                          Inventory Details
                                          <FaLock size={15} color="#818181" />
                                        </h1>

                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Year"
                                            name="year"
                                            value={formik.values.year}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.year && formik.errors.year}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Make"
                                            name="make"
                                            value={formik.values.make}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.make && formik.errors.make}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Model"
                                            name="model"
                                            value={formik.values.model}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.model && formik.errors.model}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Serial No."
                                            name="serialNo"
                                            value={formik.values.serialNo}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.serialNo && formik.errors.serialNo}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Length"
                                            name="length"
                                            value={formik.values.length}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.length && formik.errors.length}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Height"
                                            name="height"
                                            value={formik.values.height}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.height && formik.errors.height}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Width"
                                            name="width"
                                            value={formik.values.width}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.width && formik.errors.width}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Weight"
                                            name="weight"
                                            value={formik.values.weight}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.weight && formik.errors.weight}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                      </div>

                                      {/* PickUp Address */}
                                      <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                                        <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                          Pickup Address
                                        </h1>



                                        {/* Select Address Dropdown */}
                                        <div className="relative w-full mb-3">
                                          <label className="text-xs text-gray-500 font-family font-medium">
                                            Select Warehouse <span className="text-red-500">*</span>
                                          </label>
                                          <button
                                            type="button"
                                            className="w-full text-left mt-1 text-[#414141] placeholder-[#666] text-[12px] font-medium font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                                            onClick={() =>
                                              setDropdownStates(prev => ({ ...prev, pickupWareHouse: !prev.pickupWareHouse }))
                                            }
                                          >
                                            {formik.values.pickupWareHouse || "Select an option"}
                                            <FiChevronDown
                                              className={`text-lg transition-transform duration-300 ${dropdownStates.pickupWareHouse ? "rotate-180" : "rotate-0"
                                                }`}
                                            />
                                          </button>

                                          {dropdownStates.pickupWareHouse && (
                                            <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                                              {warehouseOptions.map((option, index) => (
                                                <li
                                                  key={index}
                                                  className="px-3 py-2 text-darkGray font-family hover:bg-[#81818140] hover:text-yellow text-xs cursor-pointer"
                                                  onClick={() => {
                                                    formik.setFieldValue("pickupWareHouse", option);
                                                    setDropdownStates(prev => ({ ...prev, pickupWareHouse: false }));
                                                  }}
                                                >
                                                  {option}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                          {formik.touched.pickupWareHouse && formik.errors.pickupWareHouse && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.pickupWareHouse}</p>
                                          )}
                                        </div>

                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Address"
                                            name="address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.address && formik.errors.address}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Country"
                                            name="country"
                                            value={formik.values.country}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.country && formik.errors.country}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="State/Region"
                                            name="state"
                                            value={formik.values.state}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.state && formik.errors.state}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="City"
                                            name="city"
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.city && formik.errors.city}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Zip code"
                                            name="zipCode"
                                            value={formik.values.zipCode}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.zipCode && formik.errors.zipCode}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                      </div>

                                      {/* Destination Address */}
                                      <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                                        <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                          Destination Address
                                        </h1>

                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Address"
                                            name="destinationAddress"
                                            value={formik.values.destinationAddress}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationAddress && formik.errors.destinationAddress}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Country"
                                            name="destinationCountry"
                                            value={formik.values.destinationCountry}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationCountry && formik.errors.destinationCountry}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="State/Region"
                                            name="destinationState"
                                            value={formik.values.destinationState}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationState && formik.errors.destinationState}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="City"
                                            name="destinationCity"
                                            value={formik.values.destinationCity}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationCity && formik.errors.destinationCity}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Zip code"
                                            name="destinationZipCode"
                                            value={formik.values.destinationZipCode}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationZipCode && formik.errors.destinationZipCode}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                      </div>

                                      {/* Shipment Details */}
                                      <div className='flex flex-col gap-3'>
                                        <div className="bg-white w-full border-1 h-[120px] border-[#EFEFEF] rounded-[5px] p-2">
                                          <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                            Shipment Details
                                          </h1>

                                          <div className='mb-3'>
                                            <Label>Expected Arrival Date <span className="text-red-500">*</span></Label>
                                            <MuiDatePicker
                                              name="expectedArrivalDate"
                                              value={formik.values.expectedArrivalDate}
                                              onChange={(value) => {
                                                formik.setFieldValue("expectedArrivalDate", value);
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className="bg-white w-full border-1 h-[130px] border-[#EFEFEF] rounded-[5px] p-2">
                                          <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                            Additional Information
                                          </h1>
                                          <div className='mb-3'>
                                            <Label>Shipping Notes <span className="text-red-500">*</span></Label>
                                            <textarea
                                              name="shippingNotes"
                                              value={formik.values.shippingNotes}
                                              onChange={formik.handleChange}
                                              className='w-full px-2 py-1.5 text-[#666] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md'
                                            ></textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>

                              <div className='flex items-center justify-end gap-3'>
                                <Button
                                  variant="danger"
                                  onClick={() => handleOpenDeleteModal(shipment.id)}
                                // disabled={isDeleting}
                                >
                                  {'Delete'}
                                </Button>
                                {editingShipmentId === shipment.id ? (
                                  <div className='flex gap-3 items-center'>
                                    <Button
                                      variant="primary"
                                      onClick={() => {
                                        formik.handleSubmit();
                                      }}
                                    >
                                      Update
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      onClick={() => {
                                        setEditingShipmentId(null);
                                        setIsEditMode(false)
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      populateFormikValues(shipment);
                                      setEditingShipmentId(shipment.id);
                                      setIsEditMode(true)
                                    }}
                                  >
                                    Edit
                                  </Button>
                                )}

                              </div>

                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeBoundTab === "outbound" && (
                <>
                  {shipments.length === 0 ? (
                    <div className='bg-[#F7F7F7] p-3 gap-2 mt-5 rounded-lg flex justify-center flex-col items-center cursor-pointer' onClick={handleCreateShipmentOpenModal}>
                      <FiPlusCircle size={60} strokeWidth={1.5} color='#616161' />
                      <p className='text-[16px] font-normal font-family text-[#616161]'>No Shipments Found! To create one click the button</p>
                    </div>
                  ) : (
                    <div>
                      {shipments.map((shipment: any) => (
                        <Accordion key={shipment.id} onChange={() => populateFormikValues(shipment)}
                        // sx={{marginBottom:'0.1rem'}}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <div className='flex items-center justify-between w-full'>
                              <p className='text-[17px] text-[#000] font-medium font-family'>
                                {shipment.shipment === 'inbound' ? 'Inbound' : 'Outbound'} Shipment # {shipment.id}
                              </p>


                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <form onSubmit={formik.handleSubmit}>
                                <div className="container">
                                  <div className="row mx-3">
                                    {isEditMode && (
                                      <>

                                        <div className="">

                                          <div className='flex gap-5 mb-2'>
                                            <div className='flex gap-2'>
                                              <RadioButton
                                                isSelected={formik.values.shipment === 'inbound'}
                                                onSelect={() => formik.setFieldValue('shipment', 'inbound')}
                                              />
                                              <span className='text-[13px] text-[#414141] font-medium font-family'>InBound</span>
                                            </div>
                                            <div className='flex gap-2'>
                                              <RadioButton
                                                isSelected={formik.values.shipment === 'outbound'}
                                                onSelect={() => formik.setFieldValue('shipment', 'outbound')}
                                              />
                                              <span className='text-[13px] text-[#414141] font-medium font-family'>OutBound</span>
                                            </div>
                                          </div>
                                        </div>




                                      </>
                                    )}

                                    <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4'>
                                      {/* Inventory Details */}
                                      <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                                        <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                          Inventory Details
                                          <FaLock size={15} color="#818181" />
                                        </h1>

                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Year"
                                            name="year"
                                            value={formik.values.year}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.year && formik.errors.year}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Make"
                                            name="make"
                                            value={formik.values.make}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.make && formik.errors.make}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Model"
                                            name="model"
                                            value={formik.values.model}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.model && formik.errors.model}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Serial No."
                                            name="serialNo"
                                            value={formik.values.serialNo}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.serialNo && formik.errors.serialNo}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Length"
                                            name="length"
                                            value={formik.values.length}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.length && formik.errors.length}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Height"
                                            name="height"
                                            value={formik.values.height}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.height && formik.errors.height}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Width"
                                            name="width"
                                            value={formik.values.width}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.width && formik.errors.width}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Weight"
                                            name="weight"
                                            value={formik.values.weight}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.weight && formik.errors.weight}
                                            isRequired={false}
                                            placeholder="---"
                                          />
                                        </div>
                                      </div>



                                      {/* Destination Address */}
                                      <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                                        <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                          Pickup Address
                                        </h1>

                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Address"
                                            name="destinationAddress"
                                            value={formik.values.destinationAddress}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationAddress && formik.errors.destinationAddress}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Country"
                                            name="destinationCountry"
                                            value={formik.values.destinationCountry}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationCountry && formik.errors.destinationCountry}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="State/Region"
                                            name="destinationState"
                                            value={formik.values.destinationState}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationState && formik.errors.destinationState}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="City"
                                            name="destinationCity"
                                            value={formik.values.destinationCity}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationCity && formik.errors.destinationCity}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Zip code"
                                            name="destinationZipCode"
                                            value={formik.values.destinationZipCode}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.destinationZipCode && formik.errors.destinationZipCode}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                      </div>


                                      {/* PickUp Address */}
                                      <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                                        <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                          Destination Address
                                        </h1>


                                        {/* Select Address Dropdown */}
                                        <div className="relative w-full mb-3">
                                          <label className="text-xs text-gray-500 font-family font-medium">
                                            Select Warehouse <span className="text-red-500">*</span>
                                          </label>
                                          <button
                                            type="button"
                                            className="w-full text-left mt-1 text-[#414141] placeholder-[#666] text-[12px] font-medium font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                                            onClick={() =>
                                              setDropdownStates(prev => ({ ...prev, pickupWareHouse: !prev.pickupWareHouse }))
                                            }
                                          >
                                            {formik.values.pickupWareHouse || "Select an option"}
                                            <FiChevronDown
                                              className={`text-lg transition-transform duration-300 ${dropdownStates.pickupWareHouse ? "rotate-180" : "rotate-0"
                                                }`}
                                            />
                                          </button>

                                          {dropdownStates.pickupWareHouse && (
                                            <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                                              {warehouseOptions.map((option, index) => (
                                                <li
                                                  key={index}
                                                  className="px-3 py-2 text-darkGray font-family hover:bg-[#81818140] hover:text-yellow text-xs cursor-pointer"
                                                  onClick={() => {
                                                    formik.setFieldValue("pickupWareHouse", option);
                                                    setDropdownStates(prev => ({ ...prev, pickupWareHouse: false }));
                                                  }}
                                                >
                                                  {option}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                          {formik.touched.pickupWareHouse && formik.errors.pickupWareHouse && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.pickupWareHouse}</p>
                                          )}
                                        </div>

                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Address"
                                            name="address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.address && formik.errors.address}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Country"
                                            name="country"
                                            value={formik.values.country}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.country && formik.errors.country}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="State/Region"
                                            name="state"
                                            value={formik.values.state}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.state && formik.errors.state}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="City"
                                            name="city"
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.city && formik.errors.city}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                        <div className='mb-3'>
                                          <AddLeadInput
                                            label="Zip code"
                                            name="zipCode"
                                            value={formik.values.zipCode}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.zipCode && formik.errors.zipCode}
                                            isRequired={true}
                                            placeholder="---"
                                          />
                                        </div>
                                      </div>



                                      {/* Shipment Details */}
                                      <div className='flex flex-col gap-3'>
                                        <div className="bg-white w-full border-1 h-[120px] border-[#EFEFEF] rounded-[5px] p-2">
                                          <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                            Shipment Details
                                          </h1>

                                          <div className='mb-3'>
                                            <Label>Expected Arrival Date <span className="text-red-500">*</span></Label>
                                            <MuiDatePicker
                                              name="expectedArrivalDate"
                                              value={formik.values.expectedArrivalDate}
                                              onChange={(value) => {
                                                formik.setFieldValue("expectedArrivalDate", value);
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className="bg-white w-full border-1 h-[130px] border-[#EFEFEF] rounded-[5px] p-2">
                                          <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                            Additional Information
                                          </h1>
                                          <div className='mb-3'>
                                            <Label>Shipping Notes <span className="text-red-500">*</span></Label>
                                            <textarea
                                              name="shippingNotes"
                                              value={formik.values.shippingNotes}
                                              onChange={formik.handleChange}
                                              className='w-full px-2 py-1.5 text-[#666] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md'
                                            ></textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>

                              <div className='flex items-center justify-end gap-3'>
                                <Button
                                  variant="danger"
                                  onClick={() => handleOpenDeleteModal(shipment.id)}
                                // disabled={isDeleting}
                                >
                                  {'Delete'}
                                </Button>
                                {editingShipmentId === shipment.id ? (
                                  <div className='flex gap-3 items-center'>
                                    <Button
                                      variant="primary"
                                      onClick={() => {
                                        formik.handleSubmit();
                                      }}
                                    >
                                      Update
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      onClick={() => {
                                        setEditingShipmentId(null);
                                        setIsEditMode(false)
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      populateFormikValues(shipment);
                                      setEditingShipmentId(shipment.id);
                                      setIsEditMode(true)
                                    }}
                                  >
                                    Edit
                                  </Button>
                                )}

                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </div>
                  )}
                </>
              )}

              <CreateShipmentModal open={createShipmentModal} onClose={handleCreateShipmentCloseModal} defaultShipmentType={activeBoundTab === 'inbound' ? 'inbound' : 'outbound'} />
            </>
          )}

          {activeTab == "shipmentQuotes" && (
           <ShipmentQuotesTable />
          )}
        </div>
      </div>


      <DeleteConfirmationModal
        title="Shipment"
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteShipment}
        name='Shipment'
      />
    </>
  )
}

export default Shipment