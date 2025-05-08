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
import { ErrorResponse, modalStyles } from '../../../accounts/components/AccountsModal';

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
    inventoryId?: string;
    defaultShipmentType?: 'inbound' | 'outbound';
}

// Shipment Provider 
const shipmentProvider = [
    { value: "CJ Shipping Experts" },
];

const warehouseOptions = ["Warehouse A", "Warehouse B", "Warehouse C"];


const CreateShipmentModal: React.FC<Props> = ({ open, onClose, defaultShipmentType }) => {
    const [dropdownStates, setDropdownStates] = useState({
        shipmentProvider: false,
        pickupWareHouse: false,
    });
    const { id } = useParams()
    const [mapPosition, setMapPosition] = useState<[number, number]>([29.7604, -95.3698]);
    const [showMap, setShowMap] = useState(false);
    const [loadingMap, setLoadingMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [createShipment] = useAddNewShipmentMutation();

    const { data: inventory, error, isLoading, refetch } = useGetInventoryByIdQuery(id);
    const inventoryData = inventory?.inventory


    // useEffect(() => {
    //     const geocodeAddress = async () => {
    //         if (!formik.values.selectAddress) return;

    //         const selectedAddress = addressValues.find(
    //             addr => addr.value === formik.values.selectAddress
    //         )?.address;

    //         if (!selectedAddress) return;

    //         setLoadingMap(true);
    //         try {
    //             const response = await axios.get(
    //                 `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedAddress)}`
    //             );

    //             if (response.data && response.data.length > 0) {
    //                 const { lat, lon } = response.data[0];
    //                 setMapPosition([parseFloat(lat), parseFloat(lon)]);
    //                 setShowMap(true);
    //             }
    //         } catch (error) {
    //             console.error("Geocoding error:", error);
    //         } finally {
    //             setLoadingMap(false);
    //         }
    //     };

    //     geocodeAddress();
    // }, [formik.values.selectAddress]);

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
            shipmentType: defaultShipmentType,
            shipmentProvider: "",
            selectAddress: "",
            pickupAddress: "",
            pickupCountry: "",
            pickupState: "",
            pickupCity: "",
            pickupZipCode: "",
            destinationAddress: "",
            destinationCountry: "",
            destinationState: "",
            destinationCity: "",
            destinationZipCode: "",
            expectedArrivalDate: "",
            shippingNotes: "",
            pickupWareHouse: "",
        },
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            setLoading(true)
            try {
                const pickupAddress = values.shipmentType === 'inbound' ? {
                    pickup_address: values.pickupAddress,
                    pickup_country: values.pickupCountry,
                    pickup_state: values.pickupState,
                    pickup_city: values.pickupCity,
                    pickup_zip_code: values.pickupZipCode,
                } : {
                    pickup_address: values.destinationAddress,
                    pickup_country: values.destinationCountry,
                    pickup_state: values.destinationState,
                    pickup_city: values.destinationCity,
                    pickup_zip_code: values.destinationZipCode,
                };

                const destinationAddress = values.shipmentType === 'inbound' ? {
                    destination_address: values.destinationAddress,
                    destination_country: values.destinationCountry,
                    destination_state: values.destinationState,
                    destination_city: values.destinationCity,
                    destination_zip_code: values.destinationZipCode,
                } : {
                    destination_address: values.pickupAddress,
                    destination_country: values.pickupCountry,
                    destination_state: values.pickupState,
                    destination_city: values.pickupCity,
                    destination_zip_code: values.pickupZipCode,
                };

                const payload = {
                    inventory_id: id,
                    shipment: values.shipmentType,
                    // pickup_shipment_provider: values.shipmentProvider,
                    warehouse_name: values.pickupWareHouse,
                    ...pickupAddress,
                    ...destinationAddress,
                    expected_arrival_date: values.expectedArrivalDate,
                    shipment_note: values.shippingNotes,
                };

                const response = await createShipment(payload).unwrap();
              
                toast.success(response.message || 'Shipment created successfully');
                resetForm();
                onClose();
            setLoading(false)

            } catch (error) {
            setLoading(false)

                const errorResponse = error as ErrorResponse;
                if (errorResponse?.data?.error) {
                    Object.values(errorResponse.data.error).forEach((errorMessage) => {
                        if (Array.isArray(errorMessage)) {
                            errorMessage.forEach((msg) => toast.error(msg));
                        } else {
                            toast.error(errorMessage);
                        }
                    });

                } else {
                    toast.error('Failed to create shipment');
            setLoading(false)

                }
            }
        },
    });


    const renderAddressFields = (type: 'pickup' | 'destination') => {
        const isInbound = formik.values.shipmentType === 'inbound';
        const isPickup = (type === 'pickup' && isInbound) || (type === 'destination' && !isInbound);

        const fieldPrefix = isPickup ? '' : 'destination';
        const title = isPickup ? 'Pickup Address' : 'Destination Address';


        // Determine which fields to use based on shipment type and section type
        const prefix = (type === 'pickup' && isInbound) || (type === 'destination' && !isInbound) ? 'pickup' : 'destination';

        return (
            <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px] p-2">
                <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                    {type === 'pickup' ? 'Pickup Address' : "Destination Address"}
                </h1>

                {isPickup && (
                    <>
                        {/* Shipment Provider dropdown */}
                        {/* <div className="relative w-full mb-3">
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
                        </div> */}

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


                    </>
                )}

                <div className='mb-3'>
                    <AddLeadInput
                        label="Address"
                        name={`${prefix}Address`}
                        value={formik.values[`${prefix}Address` as keyof typeof formik.values]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[`${prefix}Address` as keyof typeof formik.touched] && formik.errors[`${prefix}Address` as keyof typeof formik.errors]}
                        isRequired={true}
                        placeholder="---"
                    />
                </div>

                <div className='mb-3'>
                    <AddLeadInput
                        label="Country"
                        name={`${prefix}Country`}
                        value={formik.values[`${prefix}Country` as keyof typeof formik.values]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[`${prefix}Country` as keyof typeof formik.touched] && formik.errors[`${prefix}Country` as keyof typeof formik.errors]}
                        isRequired={true}
                        placeholder="---"
                    />
                </div>
                <div className='mb-3'>
                    <AddLeadInput
                        label="State/Region"
                        name={`${prefix}State`}
                        value={formik.values[`${prefix}State` as keyof typeof formik.values]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[`${prefix}State` as keyof typeof formik.touched] && formik.errors[`${prefix}State` as keyof typeof formik.errors]}
                        isRequired={true}
                        placeholder="---"
                    />
                </div>
                <div className='mb-3'>
                    <AddLeadInput
                        label="City"
                        name={`${prefix}City`}
                        value={formik.values[`${prefix}City` as keyof typeof formik.values]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[`${prefix}City` as keyof typeof formik.touched] && formik.errors[`${prefix}City` as keyof typeof formik.errors]}
                        isRequired={true}
                        placeholder="---"
                    />
                </div>
                <div className='mb-3'>
                    <AddLeadInput
                        label="Zip code"
                        name={`${prefix}ZipCode`}
                        value={formik.values[`${prefix}ZipCode` as keyof typeof formik.values]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[`${prefix}ZipCode` as keyof typeof formik.touched] && formik.errors[`${prefix}ZipCode` as keyof typeof formik.errors]}
                        isRequired={true}
                        placeholder="---"
                    />
                </div>
            </div>
        );
    };

    return (
        <Modal open={open} onClose={onClose}>
       <Box className={`${modalStyles.base} ${modalStyles.sizes.default}`}>
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
                                            value={inventoryData?.year || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.year && formik.errors.year}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Make"
                                            name="make"
                                            value={inventoryData?.make || ''}
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
                                            value={inventoryData?.model || ''}
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
                                            value={inventoryData?.serial_no || ''}
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
                                            value={inventoryData?.length || ''}
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
                                            value={inventoryData?.height || ''}
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
                                            value={inventoryData?.width || ''}
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
                                            value={inventoryData?.weight || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.weight && formik.errors.weight}
                                            isRequired={false}
                                            placeholder="---"
                                            disabled={true}
                                        />
                                    </div>
                                </div>

                                {/* Render address fields based on shipment type */}
                                {renderAddressFields('pickup')}
                                {renderAddressFields('destination')}

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