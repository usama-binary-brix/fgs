import { Box, Modal } from '@mui/material';
import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import RadioButton from '../../../leads/components/radiobutton/RadioButton';
import AddLeadInput from '../../../leads/components/input/AddLeadInput';
import { FaLock } from "react-icons/fa";
import { useFormik } from 'formik';
import { FiChevronDown } from 'react-icons/fi';
import MuiDatePicker from '@/components/CustomDatePicker';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

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
    userData?: any;
}

// Shipment Provider 
const shipmentProvider = [
    { value: "CJ Shipping Experts" },
    { value: "CJ Shipping Experts" },
    { value: "CJ Shipping Experts" },
    { value: "CJ Shipping Experts" },
];

// Adress 
const adressValues = [
    { value: "Warehouse 1 Houston" },
    { value: "Warehouse 1 Houston" },
    { value: "Warehouse 1 Houston" },
    { value: "Warehouse 1 Houston" },
];

const CreateShipmentModal: React.FC<Props> = ({ open, onClose }) => {
    const [dropdownStates, setDropdownStates] = useState({
        shipmentProvider: false,
        selectAdress: false,
    });

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
            selectAdress: "",
            adress: "",
            country: "",
            state: "",
            city: "",
            zipCode: "",
            destinationAddress: "",
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

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300">
                            <h2 className="text-[18px] font-medium font-family">Create Shipment</h2>
                            <RxCross2 onClick={onClose} className='cursor-pointer text-[16px]' />
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
                                {/* Inventory Details */}
                                <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px]  p-2">
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
                                            name="serial no."
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

                                {/* PickUp Adress */}
                                <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px]  p-2">
                                    <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                        Pickup Adress

                                    </h1>

                                    {/* Shipment Provider dropdown */}
                                    <div className="relative w-full">
                                        <label className="text-xs text-gray-500 font-family font-medium">Shipment Provider <span className='text-red-500'>*</span></label>
                                        <button
                                            type="button"
                                            className="w-full text-left mt-1 text-[#414141] placeholder-[#666] text-[12px] font-medium  font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
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
                                                        className="px-3 py-2 text-darkGray font-family hover:bg-[#81818140]  hover:text-yellow text-xs cursor-pointer"
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


                                    {/* Select Adress Dropdown */}
                                    <div className="relative w-full">
                                        <label className="text-xs text-gray-500 font-family font-medium">Select Adress <span className='text-red-500'>*</span></label>
                                        <button
                                            type="button"
                                            className="w-full text-left mt-1 text-[#414141] placeholder-[#666] text-[12px] font-medium  font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                                            onClick={() =>
                                                setDropdownStates(prev => ({ ...prev, selectAdress: !prev.selectAdress }))
                                            }
                                        >
                                            {formik.values.selectAdress || "Select an option"}
                                            <FiChevronDown
                                                className={`text-lg transition-transform duration-300 ${dropdownStates.selectAdress ? "rotate-180" : "rotate-0"}`}
                                            />
                                        </button>

                                        {dropdownStates.selectAdress && (
                                            <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                                                {adressValues.map((option, index) => (
                                                    <li
                                                        key={index}
                                                        className="px-3 py-2 text-darkGray font-family hover:bg-[#81818140]  hover:text-yellow text-xs cursor-pointer"
                                                        onClick={() => {
                                                            formik.setFieldValue("selectAdress", option.value);
                                                            setDropdownStates(prev => ({ ...prev, selectAdress: false }));
                                                        }}
                                                    >
                                                        {option.value}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {formik.touched.selectAdress && formik.errors.selectAdress && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.selectAdress}</p>
                                        )}
                                    </div>
                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Adress"
                                            name="adress"
                                            value={formik.values.adress}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.adress && formik.errors.adress}
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




                                </div>

                                {/* Destination Adress */}
                                <div className="bg-white w-full border-1 border-[#EFEFEF] rounded-[5px]  p-2">
                                    <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                        Destination Adress

                                    </h1>


                                    <div className='mb-3'>
                                        <AddLeadInput
                                            label="Adress"
                                            name="adress"
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
                                            name="country"
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
                                            label="State/Region"
                                            name="model"
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




                                </div>
                                {/* Shipment Details */}

                                <div className='flex flex-col gap-3'>
                                    <div className="bg-white w-full border-1 h-[120px] border-[#EFEFEF] rounded-[5px]  p-2">
                                        <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                            Destination Adress

                                        </h1>


                                        <div className='mb-3'>
                                            <Label>Expected Arrival Date <span className="text-red-500">*</span></Label>
                                            <MuiDatePicker
                                                name="date_purchased"
                                                value={formik.values.expectedArrivalDate}
                                                onChange={(value) => {
                                                    formik.setFieldValue("expectedArrivalDate", value);
                                                }}
                                            />
                                        </div>





                                    </div>
                                    <div className="bg-white w-full border-1 h-[130px] border-[#EFEFEF] rounded-[5px]  p-2">
                                        <h1 className="text-[#000] flex gap-3 items-center text-[14px] font-family font-medium mb-2">
                                            Destination Adress

                                        </h1>


                                        <div className='mb-3'>
                                            <Label>Additional Information <span className="text-red-500">*</span></Label>
                                            <textarea
                                                name="shippingNotes"
                                                value={formik.values.shippingNotes}
                                                onChange={formik.handleChange}
                                                className='w-full  px-2 py-1.5 text-[#666] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md'
                                            ></textarea>
                                        </div>





                                    </div>
                                </div>





                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-4 px-6 gap-3">
                        <Button onClick={onClose} variant="fgsoutline"
                            className='font-semibold'
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                        >
                            Create Shipment
                        </Button>

                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateShipmentModal;
