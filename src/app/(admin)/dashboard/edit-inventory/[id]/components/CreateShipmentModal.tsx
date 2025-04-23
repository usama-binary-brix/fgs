'use client'

import { Box, Modal } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import RadioButton from '../../../leads/components/radiobutton/RadioButton';
import AddLeadInput from '../../../leads/components/input/AddLeadInput';
import { FaLock } from "react-icons/fa";
import { useFormik } from 'formik';
import { FiChevronDown } from 'react-icons/fi';
import MuiDatePicker from '@/components/CustomDatePicker';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useParams } from 'next/navigation';
import { useAddNewShipmentMutation, useGetInventoryByIdQuery } from '@/store/services/api';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../../accounts/components/AccountsModal';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingY: '10px',
    overflowY: 'auto',
    borderRadius: 2,
};

interface Props {
    open: boolean;
    onClose: () => void;
    inventoryId?: string; // Changed from userData to inventoryId
}

// Shipment Provider 
const shipmentProvider = [
    { value: "CJ Shipping Experts" },
];

const addressValues = [
    {
        value: "Warehouse 1 Houston",
        address: "1234 Maple Street, Houston, TX"
    },
];

const CreateShipmentModal: React.FC<Props> = ({ open, onClose }) => {
    const [dropdownStates, setDropdownStates] = useState({
        shipmentProvider: false,
        selectAddress: false,
    });
    const { id } = useParams()
    const [mapPosition, setMapPosition] = useState<[number, number]>([29.7604, -95.3698]); // Default to Houston
    const [showMap, setShowMap] = useState(false);
    const [loadingMap, setLoadingMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [createShipment] = useAddNewShipmentMutation();

    const { data: inventory, error, isLoading, refetch } = useGetInventoryByIdQuery(id);
    const inventoryData = inventory?.inventory
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
            shipmentType: '',
            shipmentProvider: "",
            selectAddress: "",
            address: "",
            country: "",
            state: "",
            city: "",
            zipCode: "",
            destinationAddress: "",
            destinationCountry:"",
            destinationState: "",
            destinationCity: "",
            destinationZipCode: "",
            expectedArrivalDate: "",
            shippingNotes: "",
            pickupWareHouse:"",

        },
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    inventory_id: id, // Send inventory ID instead of full details
                    shipment: values.shipmentType,
                    pickup_shipment_provider: values.shipmentProvider,
                    pickup_warehouse_name:values.pickupWareHouse,
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

                // Assuming you have a mutation hook called 'createShipment' defined in your API slice
                const response = await createShipment(payload).unwrap();

                console.log('Shipment created:', response);
                toast.success(response.message || 'Shipment created successfully');
                resetForm();
                onClose(); // Close modal on success
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



    useEffect(() => {
        const geocodeAddress = async () => {
            if (!formik.values.selectAddress) return;

            const selectedAddress = addressValues.find(
                addr => addr.value === formik.values.selectAddress
            )?.address;

            if (!selectedAddress) return;

            setLoadingMap(true);
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedAddress)}`
                );

                if (response.data && response.data.length > 0) {
                    const { lat, lon } = response.data[0];
                    setMapPosition([parseFloat(lat), parseFloat(lon)]);
                    setShowMap(true);
                }
            } catch (error) {
                console.error("Geocoding error:", error);
            } finally {
                setLoadingMap(false);
            }
        };

        geocodeAddress();
    }, [formik.values.selectAddress]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <div className='flex justify-between items-center px-4 py-2 border-b'>
                            <p className='text-xl font-semibold'>Create Shipment</p>
                            <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />
                        </div>

                        <div className="p-4">
                            <label className='text-[12.5px] font-normal font-family text-[#818181] mb-4'>
                                Shipment <span className='text-red-500'>*</span>
                            </label>
                            <div className='flex gap-5 mt-1'>
                                <div className='flex gap-2'>
                                    <RadioButton
                                        isSelected={formik.values.shipmentType === 'inbound'}
                                        onSelect={() => formik.setFieldValue('shipmentType', 'inbound')}
                                    />
                                    <span className='text-[13px] text-[#414141] font-medium font-family'>InBound</span>
                                </div>
                                <div className='flex gap-2'>
                                    <RadioButton
                                        isSelected={formik.values.shipmentType === 'outbound'}
                                        onSelect={() => formik.setFieldValue('shipmentType', 'outbound')}
                                    />
                                    <span className='text-[13px] text-[#414141] font-medium font-family'>OutBound</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row mx-3">
                            <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4'>
                                {/* Inventory Details (locked) */}
                                <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                                    <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                        Inventory Details
                                        <FaLock size={15} color="#818181" />
                                    </h1>

                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Year"
                                            name="year"
                                            value={inventoryData.year}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.year && formik.errors.year}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true} // Make field read-only
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Make"
                                            name="make"
                                            value={inventoryData.make}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.make && formik.errors.make}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Model"
                                            name="model"
                                            value={inventoryData.model}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.model && formik.errors.model}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Serial No."
                                            name="serialNo"
                                            value={inventoryData.serial_no}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.serialNo && formik.errors.serialNo}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Length"
                                            name="length"
                                            value={inventoryData.length}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.length && formik.errors.length}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Height"
                                            name="height"
                                            value={inventoryData.height}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.height && formik.errors.height}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Width"
                                            name="width"
                                            value={inventoryData.width}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.width && formik.errors.width}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Weight"
                                            name="weight"
                                            value={inventoryData.weight}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.weight && formik.errors.weight}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                </div>

                                {/* PickUp Address */}
                                <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                                    <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                        Pickup Address
                                    </h1>

                                    {/* Shipment Provider dropdown */}
                                    <div className="relative w-full mb-3">
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
                                    <div className="relative w-full mb-3">
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
                                                            formik.setFieldValue("address", option.address);
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
                                            label="Pickup Warehouse"
                                            name="pickupWareHouse"
                                            value={formik.values.pickupWareHouse}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.pickupWareHouse && formik.errors.pickupWareHouse}
                                            isRequired={true}
                                            placeholder="---"
                                        />
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

                                    {/* {showMap && (
                                        <div className="mb-3 h-36 w-full">
                                            <MapContainer
                                                center={mapPosition as [number, number]}
                                                {...{
                                                    attribution: ''
                                                } as any}
                                                zoom={15}
                                                style={{ height: '100%', width: '100%', borderRadius: '4px' }}
                                                zoomControl={false} // This disables the zoom controls
                                                attributionControl={false}

                                            >

                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    {...{
                                                        attribution: ''
                                                    } as any}
                                                />

                                                <Marker position={mapPosition}>
                                                    <Popup>
                                                        {formik.values.address}
                                                    </Popup>
                                                </Marker>

                                            </MapContainer>
                                        </div>
                                    )} */}
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

                    {/* Submit Button */}
                    <div className="flex justify-end mt-4 px-6 gap-3">
                        <Button onClick={onClose} variant="fgsoutline" className='font-semibold'>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Shipment'}
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateShipmentModal;