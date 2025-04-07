import React, { useState } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';

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
  const [stages, setStages] = useState<string[]>([
    'Motor Installation',
    'Cabel Replacement',
    'Control System Installation',
    'Interior Cabin Lighting'
  ]);
  const [newStage, setNewStage] = useState('');

  const handleAddStage = () => {
    if (newStage.trim()) {
      setStages([...stages, newStage.trim()]);
      setNewStage('');
    }
  };

  const handleDeleteStage = (index: number) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };

  return (
    <Modal open={open} onClose={onClose} sx={{zIndex:9999}}>
      <Box sx={modalStyle}>
        <div className="border-b border-gray-400 mb-2 py-2">
          <div className="flex justify-between items-center px-4">
            <p className="text-lg font-semibold">Edit Timeline</p>
            <RxCross2 onClick={onClose} className="cursor-pointer text-2xl" />
          </div>
        </div>

        {/* Add New Stage */}
        <div className="px-4 mb-4">
          <p className="text-sm font-medium mb-1">Add New Stage</p>
          <div className="flex gap-2">
            <div className='w-[84%]'>
            <Input
            //   variant="outlined"
            //   size="small"
              placeholder="Stage Name Here"
            //   fullWidth
            className='w-full'
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
            />
            </div>
            <Button
            className='h-9'
              variant="primary"
            //   sx={{ bgcolor: '#d38224', '&:hover': { bgcolor: '#b96b1b' } }}
              onClick={handleAddStage}
            >
              Add Stage
            </Button>
          </div>
        </div>

        {/* Current Stages */}
        <div className="px-4 mb-4">
          <p className="text-sm font-medium mb-2">Current Stages</p>
          <div className="flex flex-col gap-2">
            {stages.map((stage, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FaGripVertical className="text-gray-500" />
                  <span>{stage}</span>
                </div>
                <div className="flex gap-2">
                  <IconButton size="small">
                    <FaEdit className="text-gray-600" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteStage(index)}>
                    <FaTrash className="text-gray-600" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 px-4 pb-4">
          <Button variant="fgsoutline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            // sx={{ bgcolor: '#d38224', '&:hover': { bgcolor: '#b96b1b' } }}
          >
            Update
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditTimelineModal;
