import MuiDatePicker from '@/components/CustomDatePicker';
import { Box, Modal } from '@mui/material'
import React, { useEffect } from 'react'
import { RxCross2 } from 'react-icons/rx'
import Button from '@/components/ui/button/Button';
import { useParams } from 'next/navigation';
import { ErrorResponse } from '@/app/(admin)/dashboard/accounts/components/AccountsModal';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAddShipmentQuoteMutation, useGetBrokerShipmentByIdQuery, useGetShipmentByIdQuery } from '@/store/services/api';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '35%',
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
  InventoryId?: any;
}

const SubmitQuoteModal: React.FC<Props> = ({ open, onClose, InventoryId }) => {
  const { id } = useParams();
  const [addQuote] = useAddShipmentQuoteMutation();
  const { refetch: refetchShipment } = useGetBrokerShipmentByIdQuery(id); 


  const formik = useFormik({
    initialValues: {
      shipping_cost: '',
      estimate_arrival_time: '',
    },
    validationSchema: Yup.object().shape({
      shipping_cost: Yup.number()
        .typeError('Shipping cost must be a number')
        .required('Shipping cost is required')
        .positive('Amount must be greater than 0'),
      estimate_arrival_time: Yup.date()
        .required('Estimated arrival time is required')
        .min(new Date(), 'Estimated arrival time must be in the future'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (!InventoryId) {
          toast.error("No inventory selected");
          return;
        }
        
        const payload = {
          shipping_cost: values.shipping_cost,
          estimate_arrival_time: values.estimate_arrival_time,
          inventory_id: InventoryId,
          shipment_id: id,
        };
        
        const response = await addQuote(payload).unwrap();
        toast.success(response.message);
        const shipmentData = await refetchShipment();
        console.log('Shipment data after quote submission:', shipmentData.data);

        resetForm();
        onClose();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        if (errorResponse?.data?.error) {
          if (Array.isArray(errorResponse.data.error)) {
            errorResponse.data.error.forEach((msg) => toast.error(msg));
          } else {
            if (typeof errorResponse.data.error === 'string') {
              toast.error(errorResponse.data.error);
            }
          }
        } else {
          toast.error('Failed to submit quote');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open, InventoryId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <div className='border-b border-[#ddd] mb-3 py-3'>
          <div className='flex justify-between items-center px-4'>
            <p className='text-[18px] text-[#000] font-medium font-family'>Submit Your Quote</p>
            <RxCross2 onClick={onClose} className='cursor-pointer text-3xl w-[16px] h-[16px] text-[#616161]' />
          </div>
        </div>
        
        <form onSubmit={formik.handleSubmit} autoComplete='off' className='px-4'>
          <div className='flex flex-col gap-2 mb-3'>
            <label htmlFor="shipping_cost" className='text-[#818181] text-[12.5px] font-family font-normal'>
              Shipping Cost
            </label>
            <input
              type="text"
              id="shipping_cost"
              name="shipping_cost"
              className='w-full border-1 border-[#e8e8e8] px-2 py-1 rounded-xs text-[#616161] text-[13px] font-medium font-family outline-0'
              placeholder='Enter amount'
              value={formik.values.shipping_cost}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) && value !== "0" && value !== "00") {
                  formik.setFieldValue("shipping_cost", value);
                }
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.shipping_cost && formik.errors.shipping_cost && (
              <p className="text-red-500 text-xs">{formik.errors.shipping_cost}</p>
            )}
          </div>
          
          <div className='flex flex-col gap-2 mb-3'>
            <label htmlFor="estimate_arrival_time" className='text-[#818181] text-[12.5px] font-family font-normal'>
              Estimated Time of Arrival
            </label>
            <MuiDatePicker
              name="estimate_arrival_time"
              value={formik.values.estimate_arrival_time}
              onChange={(value) => {
                formik.setFieldValue("estimate_arrival_time", value);
              }}
         
            />
            {formik.touched.estimate_arrival_time && formik.errors.estimate_arrival_time && (
              <p className="text-red-500 text-xs">{formik.errors.estimate_arrival_time}</p>
            )}
          </div>
          
          <div className='flex items-center gap-4 justify-end mt-6'>
            <Button 
              onClick={onClose} 
              variant="fgsoutline"
              className='font-semibold font-family'
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className='font-semibold font-family'
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}

export default SubmitQuoteModal;