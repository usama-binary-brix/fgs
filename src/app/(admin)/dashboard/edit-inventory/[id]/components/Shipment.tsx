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
import { useGetAllShipmentsQuery } from '@/store/services/api';

// Shipment Provider 
const shipmentProvider = [
  { value: "CJ Shipping Experts" },
  { value: "CJ Shipping Experts" },
  { value: "CJ Shipping Experts" },
  { value: "CJ Shipping Experts" },
];

// Address 
const addressValues = [
  { value: "Warehouse 1 Houston" },
  { value: "Warehouse 1 Houston" },
  { value: "Warehouse 1 Houston" },
  { value: "Warehouse 1 Houston" },
];

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

  const [activeBoundTab, setActiveBoundTab] = useState("inbound");
  const [createShipmentModal, setCreateShipmentModal] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    shipmentProvider: false,
    selectAddress: false,
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
      year: '',
      make: '',
      model: '',
      serialNo: '',
      length: '',
      height: '',
      width: '',
      weight: '',
      shipmentType: '',
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
    },
    onSubmit: values => {
      console.log('Form Values:', values);
      // handle API submit here
    }
  });

  const handleCreateShipmentOpenModal = () => {
    setCreateShipmentModal(true);
  }

  const handleCreateShipmentCloseModal = () => {
    setCreateShipmentModal(false);
  }

  // Function to populate formik values when accordion is expanded
  const populateFormikValues = (shipment: any) => {
    formik.setValues({
      year: shipment.inventory.year || '',
      make: shipment.inventory.make || '',
      model: shipment.inventory.model || '',
      serialNo: shipment.inventory.serial_no || '',
      length: shipment.inventory.length || '',
      height: shipment.inventory.height || '',
      width: shipment.inventory.width || '',
      weight: shipment.inventory.weight || '',
      shipmentType: shipment.shipment || '',
      shipmentProvider: shipment.pickup_shipment_provider || "",
      selectAddress: shipment.pickup_warehouse_name || "",
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
                    <div className='bg-[#F7F7F7] p-3 gap-2 mt-5 rounded-lg flex justify-center flex-col items-center cursor-pointer'  onClick={handleCreateShipmentOpenModal}>
                      <FiPlusCircle size={60} strokeWidth={1.5} color='#616161' />
                      <p className='text-[16px] font-normal font-family text-[#616161]'>No Shipments Found! To create one click the button</p>
                    </div>
                  ) : (
                    <div>
                      {shipments.map((shipment: any) => (
                        <Accordion key={shipment.id} onChange={() => populateFormikValues(shipment)} defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <p className='text-[17px] text-[#000] font-medium font-family'>
                              {shipment.shipment === 'inbound' ? 'Inbound' : 'Outbound'} Shipment # {shipment.id}
                            </p>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <form onSubmit={formik.handleSubmit} >
                                <div className="container">
                                  <div className="row mx-3">
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

                                        {/* Shipment Provider dropdown */}
                                        <div className="relative w-full">
                                          <label className="text-xs text-gray-500 font-family font-medium">Shipment Provider <span className='text-red-500'>*</span></label>
                                          <button
                                            type="button"
                                            className="w-full text-left mt-1 text-[#414141] placeholder-[#666] text-[12px] font-medium font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                                            onClick={() =>
                                              setDropdownStates(prev => ({ ...prev, shipmentProvider: !prev.shipmentProvider }))
                                            }
                                          >
                                            {formik.values.shipmentProvider || "Select an option"}
                                            <FiChevronDown
                                              className={`text-lg transition-transform duration-300 ${dropdownStates.shipmentProvider ? "rotate-180" : "rotate-0"}`}
                                            />
                                          </button>

                                          {dropdownStates.shipmentProvider && (
                                            <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                                              {shipmentProvider.map((option, index) => (
                                                <li
                                                  key={index}
                                                  className="px-3 py-2 text-darkGray font-family hover:bg-[#81818140] hover:text-yellow text-xs cursor-pointer"
                                                  onClick={() => {
                                                    formik.setFieldValue("shipmentProvider", option.value);
                                                    setDropdownStates(prev => ({ ...prev, shipmentProvider: false }));
                                                  }}
                                                >
                                                  {option.value}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                          {formik.touched.shipmentProvider && formik.errors.shipmentProvider && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.shipmentProvider}</p>
                                          )}
                                        </div>

                                        {/* Select Address Dropdown */}
                                        <div className="relative w-full">
                                          <label className="text-xs text-gray-500 font-family font-medium">Select Address <span className='text-red-500'>*</span></label>
                                          <button
                                            type="button"
                                            className="w-full text-left mt-1 text-[#414141] placeholder-[#666] text-[12px] font-medium font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                                            onClick={() =>
                                              setDropdownStates(prev => ({ ...prev, selectAddress: !prev.selectAddress }))
                                            }
                                          >
                                            {formik.values.selectAddress || "Select an option"}
                                            <FiChevronDown
                                              className={`text-lg transition-transform duration-300 ${dropdownStates.selectAddress ? "rotate-180" : "rotate-0"}`}
                                            />
                                          </button>

                                          {dropdownStates.selectAddress && (
                                            <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                                              {addressValues.map((option, index) => (
                                                <li
                                                  key={index}
                                                  className="px-3 py-2 text-darkGray font-family hover:bg-[#81818140] hover:text-yellow text-xs cursor-pointer"
                                                  onClick={() => {
                                                    formik.setFieldValue("selectAddress", option.value);
                                                    setDropdownStates(prev => ({ ...prev, selectAddress: false }));
                                                  }}
                                                >
                                                  {option.value}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                          {formik.touched.selectAddress && formik.errors.selectAddress && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.selectAddress}</p>
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
                        <Accordion key={shipment.id} onChange={() => populateFormikValues(shipment)} defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <p className='text-[17px] text-[#000] font-medium font-family'>
                              {shipment.shipment === 'inbound' ? 'Inbound' : 'Outbound'} Shipment # {shipment.id}
                            </p>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <form onSubmit={formik.handleSubmit}>
                                <div className="container">
                                  <div className="row mx-3">
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

                                        {/* Shipment Provider dropdown */}
                                        <div className="relative w-full">
                                          <label className="text-xs text-gray-500 font-family font-medium">Shipment Provider <span className='text-red-500'>*</span></label>
                                          <button
                                            type="button"
                                            className="w-full text-left mt-1 text-[#414141] placeholder-[#666] text-[12px] font-medium font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                                            onClick={() =>
                                              setDropdownStates(prev => ({ ...prev, shipmentProvider: !prev.shipmentProvider }))
                                            }
                                          >
                                            {formik.values.shipmentProvider || "Select an option"}
                                            <FiChevronDown
                                              className={`text-lg transition-transform duration-300 ${dropdownStates.shipmentProvider ? "rotate-180" : "rotate-0"}`}
                                            />
                                          </button>

                                          {dropdownStates.shipmentProvider && (
                                            <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                                              {shipmentProvider.map((option, index) => (
                                                <li
                                                  key={index}
                                                  className="px-3 py-2 text-darkGray font-family hover:bg-[#81818140] hover:text-yellow text-xs cursor-pointer"
                                                  onClick={() => {
                                                    formik.setFieldValue("shipmentProvider", option.value);
                                                    setDropdownStates(prev => ({ ...prev, shipmentProvider: false }));
                                                  }}
                                                >
                                                  {option.value}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                          {formik.touched.shipmentProvider && formik.errors.shipmentProvider && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.shipmentProvider}</p>
                                          )}
                                        </div>

                                        {/* Select Address Dropdown */}
                                        <div className="relative w-full">
                                          <label className="text-xs text-gray-500 font-family font-medium">Select Address <span className='text-red-500'>*</span></label>
                                          <button
                                            type="button"
                                            className="w-full text-left mt-1 text-[#414141] placeholder-[#666] text-[12px] font-medium font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                                            onClick={() =>
                                              setDropdownStates(prev => ({ ...prev, selectAddress: !prev.selectAddress }))
                                            }
                                          >
                                            {formik.values.selectAddress || "Select an option"}
                                            <FiChevronDown
                                              className={`text-lg transition-transform duration-300 ${dropdownStates.selectAddress ? "rotate-180" : "rotate-0"}`}
                                            />
                                          </button>

                                          {dropdownStates.selectAddress && (
                                            <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                                              {addressValues.map((option, index) => (
                                                <li
                                                  key={index}
                                                  className="px-3 py-2 text-darkGray font-family hover:bg-[#81818140] hover:text-yellow text-xs cursor-pointer"
                                                  onClick={() => {
                                                    formik.setFieldValue("selectAddress", option.value);
                                                    setDropdownStates(prev => ({ ...prev, selectAddress: false }));
                                                  }}
                                                >
                                                  {option.value}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                          {formik.touched.selectAddress && formik.errors.selectAddress && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.selectAddress}</p>
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
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </div>
                  )}
                </>
              )}

              <CreateShipmentModal open={createShipmentModal} onClose={handleCreateShipmentCloseModal} />
            </>
          )}

          {activeTab === "shipmentQuotes" && (
            <div className="rounded-lg border hidden border-[#DDD] bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="overflow-auto rounded-lg">
                <Table className='table-auto'>
                  <TableHeader className="border-b bg-[#F7F7F7] text-[#616161] font-family font-medium text-[12.5px] border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      {[
                        'Company Name', 'Quote Amount', 'Estimated Time of Arrival', 'Contact Information', 'Action'
                      ].map((heading) => (
                        <TableCell key={heading} className="px-5 py-3 whitespace-nowrap overflow-hidden font-medium text-gray-500 text-start text-[14px] dark:text-gray-400">
                          <div className='w-full flex gap-5 justify-between items-center'>
                            {heading}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M4.8513 6.35227C4.63162 6.57194 4.63162 6.9281 4.8513 7.14777C5.07097 7.36743 5.42707 7.36743 5.64675 7.14777L4.8513 6.35227ZM7.49902 4.50002H8.06152C8.06152 4.27251 7.9245 4.0674 7.71427 3.98034C7.50412 3.89327 7.26217 3.9414 7.1013 4.10227L7.49902 4.50002ZM6.93652 13.5C6.93652 13.8107 7.18837 14.0625 7.49902 14.0625C7.80967 14.0625 8.06152 13.8107 8.06152 13.5H6.93652ZM13.1468 11.6477C13.3664 11.4281 13.3664 11.072 13.1468 10.8523C12.9271 10.6326 12.5709 10.6326 12.3513 10.8523L13.1468 11.6477ZM10.499 13.5H9.93652C9.93652 13.7275 10.0736 13.9326 10.2838 14.0197C10.4939 14.1068 10.7359 14.0586 10.8968 13.8977L10.499 13.5ZM11.0615 4.50002C11.0615 4.18936 10.8097 3.93752 10.499 3.93752C10.1884 3.93752 9.93652 4.18936 9.93652 4.50002H11.0615ZM5.64675 7.14777L7.89675 4.89777L7.1013 4.10227L4.8513 6.35227L5.64675 7.14777ZM6.93652 4.50002L6.93652 13.5H8.06152V4.50002H6.93652ZM12.3513 10.8523L10.1013 13.1023L10.8968 13.8977L13.1468 11.6477L12.3513 10.8523ZM11.0615 13.5L11.0615 4.50002H9.93652L9.93652 13.5H11.0615Z" fill="#616161" />
                            </svg>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody className="dark:divide-white/[0.05]">
                    {shipmentQuotesData?.map((lead: any) => (
                      <TableRow className={`!border-b-0 ${activeRowId === lead.id ? 'bg-[#FFFAF3]' : ''}`} key={lead.id}>
                        <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-start whitespace-nowrap overflow-hidden">{lead.companeName}</TableCell>
                        <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-start">{lead.quoteAmount}</TableCell>
                        <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-start">{lead.estimateTimeOfArrival}</TableCell>
                        <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-start">{lead.contactInformation}</TableCell>
                        <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-center relative">
                          <div className="relative inline-block">
                            <button
                              onClick={() => toggleDropdown(lead.id)}
                              className={`dropdown-toggle p-1 rounded ${openDropdown === lead.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                            </button>

                            {openDropdown === lead.id && (
                              <div className="absolute right-9 top-[-7px] mt-2 z-[999] w-50 bg-white p-1 shadow-md border rounded-sm">
                                <DropdownItem
                                  onItemClick={() => {
                                    router.push(`/dashboard/edit-inventory/${lead.id}`);
                                    closeDropdown();
                                  }}
                                  className="flex w-full text-left text-[12px] font-family text-[#414141] whitespace-nowrap font-normal rounded dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                >
                                  Accept & Confirm Shipment
                                </DropdownItem>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className='px-6 border-t'>
                <Pagination
                // currentPage={currentPage}
                // totalPages={data?.inventories?.last_page || 1}
                // onPageChange={handlePageChange}
                // perPage={perPage}
                // onPerPageChange={handlePerPageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Shipment