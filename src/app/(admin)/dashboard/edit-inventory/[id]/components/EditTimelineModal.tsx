import { Box, Modal } from '@mui/material'
import React from 'react'
import { RxCross2 } from 'react-icons/rx';


interface Props {
    open: boolean;
    onClose: () => void;
}
const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingY: '10px',
    overflowY: 'auto',
    borderRadius: 2,
};


const EditTimelineModal: React.FC<Props> = ({ open, onClose }) => {

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    <div className=' border-b border-gray-400 mb-2 py-2'>

                        <div className='flex justify-between items-center px-4'>
                            <p className='text-lg font-semibold'>Edit Timeline</p>
                            <RxCross2 onClick={onClose} className='cursor-pointer text-2xl' />

                        </div>
                    </div>


                </Box>
            </Modal>

        </>
    )
}

export default EditTimelineModal