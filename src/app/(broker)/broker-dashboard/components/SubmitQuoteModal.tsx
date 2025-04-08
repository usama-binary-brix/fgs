import MuiDatePicker from '@/components/CustomDatePicker';
import { Box, Modal } from '@mui/material'
import React from 'react'
import { RxCross2 } from 'react-icons/rx'
import Button from '@/components/ui/button/Button';

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
}

const SubmitQuoteModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <div className=' border-b border-[#ddd] mb-3 py-3'>

            <div className='flex justify-between items-center px-4'>
              <p className='text-[18px] text-[#000] font-medium font-family'>Submit Your Quote</p>

              <RxCross2 onClick={onClose} className='cursor-pointer text-3xl w-[16px] h-[16px] text-[#616161]' />

            </div>
          </div>
          <form autoComplete='off' className='px-4'>
            <div className='flex flex-col gap-2 mb-3'>
              <label htmlFor="" className='text-[#818181] text-[12.5px] font-family font-normal'>Shipping Cost</label>
              <input type="text" className='w-full border-1 border-[#e8e8e8] px-2 py-1 rounded-xs text-[#616161] text-[13px] font-medium font-family outline-0' placeholder='---' />
            </div>
            <div className='flex flex-col gap-2 mb-3'>
              <label htmlFor="" className='text-[#818181] text-[12.5px] font-family font-normal'>Estimated Time of Arrival</label>
              <MuiDatePicker
                name="date_purchased"
                value=""



              />
            </div>
            <div className='flex items-center gap-4 justify-end mt-6'>
              <Button onClick={onClose} variant="fgsoutline"
                className='font-semibold font-family'
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className='font-semibold font-family'
                
              >
                Submit
              </Button>
            </div>

          </form>
        </Box>
      </Modal>
    </>
  )
}

export default SubmitQuoteModal