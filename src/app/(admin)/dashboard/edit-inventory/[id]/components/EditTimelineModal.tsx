// import React, { useCallback, useState } from 'react';
// import { Box, Modal, IconButton } from '@mui/material';
// import { RxCross2 } from 'react-icons/rx';
// import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import Input from '@/components/form/input/InputField';
// import Button from '@/components/ui/button/Button';

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }

// interface DraggableStageProps {
//   stage: string;
//   index: number;
//   moveStage: (fromIndex: number, toIndex: number) => void;
//   handleDeleteStage: (index: number) => void;
// }

// const ItemTypes = {
//   STAGE: 'stage',
// };

// const DraggableStage: React.FC<DraggableStageProps> = ({ stage, index, moveStage, handleDeleteStage }) => {
//   const ref = React.useRef<HTMLDivElement>(null);

//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.STAGE,
//     item: { index },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.STAGE,
//     hover(item: { index: number }, monitor) {
//       if (!ref.current) return;
//       const dragIndex = item.index;
//       const hoverIndex = index;

//       if (dragIndex === hoverIndex) return;

//       const hoverBoundingRect = ref.current?.getBoundingClientRect();
//       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//       const clientOffset = monitor.getClientOffset();
//       const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

//       moveStage(dragIndex, hoverIndex);
//       item.index = hoverIndex;
//     },
//   });

//   const setRefs = useCallback(
//     (node: HTMLDivElement) => {
//       (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
//       drag(node);
//       drop(node);
//     },
//     [drag, drop]
//   );

//   return (
//     <div
//       ref={setRefs}
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//       className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md"
//     >
//       <div className="flex items-center gap-2">
//         <div>
//           <FaGripVertical className="text-gray-500 cursor-move" />
//         </div>
//         <span>{stage}</span>
//       </div>
//       <div className="flex gap-2">
//         <IconButton size="small">
//           <FaEdit className="text-gray-600" />
//         </IconButton>
//         <IconButton 
//           size="small" 
//           onClick={() => handleDeleteStage(index)}
//         >
//           <FaTrash className="text-gray-600" />
//         </IconButton>
//       </div>
//     </div>
//   );
// };

// const modalStyle = {
//   position: 'absolute' as const,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '50%',
//   maxHeight: '90vh',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   paddingY: '10px',
//   overflowY: 'auto',
//   borderRadius: 2,
// };

// const EditTimelineModal: React.FC<Props> = ({ open, onClose }) => {
//   const [stages, setStages] = useState<string[]>([
//     'Motor Installation',
//     'Cabel Replacement',
//     'Control System Installation',
//     'Interior Cabin Lighting'
//   ]);
//   const [newStage, setNewStage] = useState('');

//   const handleAddStage = () => {
//     if (newStage.trim()) {
//       setStages([...stages, newStage.trim()]);
//       setNewStage('');
//     }
//   };

//   const handleDeleteStage = (index: number) => {
//     const updatedStages = [...stages];
//     updatedStages.splice(index, 1);
//     setStages(updatedStages);
//   };

//   const moveStage = (fromIndex: number, toIndex: number) => {
//     const updatedStages = [...stages];
//     const [movedStage] = updatedStages.splice(fromIndex, 1);
//     updatedStages.splice(toIndex, 0, movedStage);
//     setStages(updatedStages);
//   };

//   const handleUpdate = () => {
//     console.log("Updated stages array:", stages);
//     onClose();
//   };

//   return (
//     <Modal open={open} onClose={onClose} sx={{ zIndex: 9999 }}>
//       <Box sx={modalStyle}>
//         <div className="border-b border-gray-400 mb-2 py-2">
//           <div className="flex justify-between items-center px-4">
//             <p className="text-lg font-semibold">Edit Timeline</p>
//             <RxCross2 onClick={onClose} className="cursor-pointer text-2xl" />
//           </div>
//         </div>

//         {/* Add New Stage */}
//         <div className="px-4 mb-4">
//           <p className="text-sm font-medium mb-1">Add New Stage</p>
//           <div className="flex gap-2">
//             <div className='w-[84%]'>
//               <Input
//                 placeholder="Stage Name Here"
//                 className='w-full'
//                 value={newStage}
//                 onChange={(e) => setNewStage(e.target.value)}
//               />
//             </div>
//             <Button
//               className='h-9'
//               variant="primary"
//               onClick={handleAddStage}
//             >
//               Add Stage
//             </Button>
//           </div>
//         </div>

//         {/* Current Stages */}
//         <div className="px-4 mb-4">
//           <p className="text-sm font-medium mb-2">Current Stages</p>
//           <DndProvider backend={HTML5Backend}>
//             <div className="flex flex-col gap-2">
//               {stages.map((stage, index) => (
//                 <DraggableStage
//                   key={index}
//                   index={index}
//                   stage={stage}
//                   moveStage={moveStage}
//                   handleDeleteStage={handleDeleteStage}
//                 />
//               ))}
//             </div>
//           </DndProvider>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-2 px-4 pb-4">
//           <Button variant="fgsoutline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleUpdate}
//           >
//             Update
//           </Button>
//         </div>
//       </Box>
//     </Modal>
//   );
// };

// export default EditTimelineModal;

import React, { useCallback, useState } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface DraggableStageProps {
  stage: string;
  index: number;
  moveStage: (fromIndex: number, toIndex: number) => void;
  handleDeleteStage: (index: number) => void;
  handleEditStage: (index: number) => void;
}

const ItemTypes = {
  STAGE: 'stage',
};

const DraggableStage: React.FC<DraggableStageProps> = ({ 
  stage, 
  index, 
  moveStage, 
  handleDeleteStage,
  handleEditStage 
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.STAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.STAGE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveStage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      drag(node);
      drop(node);
    },
    [drag, drop]
  );

  return (
    <div
      ref={setRefs}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md"
    >
      <div className="flex items-center gap-2">
        <div>
          <FaGripVertical className="text-gray-500 cursor-move" />
        </div>
        <span>{stage}</span>
      </div>
      <div className="flex gap-2">
        <IconButton 
          size="small"
          onClick={() => handleEditStage(index)}
        >
          <FaEdit className="text-gray-600" />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={() => handleDeleteStage(index)}
        >
          <FaTrash className="text-gray-600" />
        </IconButton>
      </div>
    </div>
  );
};

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editStageValue, setEditStageValue] = useState('');

  const handleAddStage = () => {
    if (newStage.trim()) {
      setStages([...stages, newStage.trim()]);
      setNewStage('');
    }
  };

  const handleUpdateStage = () => {
    if (editingIndex !== null && editStageValue.trim()) {
      const updatedStages = [...stages];
      updatedStages[editingIndex] = editStageValue.trim();
      setStages(updatedStages);
      setEditingIndex(null);
      setEditStageValue('');
    }
  };

  const handleDeleteStage = (index: number) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
    // If we're deleting the stage being edited, reset edit mode
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditStageValue('');
    }
  };

  const handleEditStage = (index: number) => {
    setEditingIndex(index);
    setEditStageValue(stages[index]);
  };

  const moveStage = (fromIndex: number, toIndex: number) => {
    const updatedStages = [...stages];
    const [movedStage] = updatedStages.splice(fromIndex, 1);
    updatedStages.splice(toIndex, 0, movedStage);
    setStages(updatedStages);
    // Update editingIndex if we're moving the stage being edited
    if (editingIndex !== null) {
      if (fromIndex === editingIndex) {
        setEditingIndex(toIndex);
      } else if (fromIndex < editingIndex && toIndex >= editingIndex) {
        setEditingIndex(editingIndex - 1);
      } else if (fromIndex > editingIndex && toIndex <= editingIndex) {
        setEditingIndex(editingIndex + 1);
      }
    }
  };

  const handleUpdate = () => {
    console.log("Updated stages array:", stages);
    onClose();
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditStageValue('');
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 9999 }}>
      <Box sx={modalStyle}>
        <div className="border-b border-gray-400 mb-2 py-2">
          <div className="flex justify-between items-center px-4">
            <p className="text-lg font-semibold">Edit Timeline</p>
            <RxCross2 onClick={onClose} className="cursor-pointer text-2xl" />
          </div>
        </div>

        {/* Add/Edit Stage */}
        <div className="px-4 mb-4">
          <p className="text-sm font-medium mb-1">
            {editingIndex !== null ? 'Edit Stage' : 'Add New Stage'}
          </p>
          <div className="flex gap-2">
            <div className='w-[84%]'>
              <Input
                placeholder="Stage Name Here"
                className='w-full'
                value={editingIndex !== null ? editStageValue : newStage}
                onChange={(e) => 
                  editingIndex !== null 
                    ? setEditStageValue(e.target.value) 
                    : setNewStage(e.target.value)
                }
              />
            </div>
            {editingIndex !== null ? (
              <>
                <Button
                  className='h-9'
                  variant="primary"
                  onClick={handleUpdateStage}
                >
                  Update
                </Button>
                <Button
                  className='h-9'
                  variant="fgsoutline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                className='h-9'
                variant="primary"
                onClick={handleAddStage}
              >
                Add Stage
              </Button>
            )}
          </div>
        </div>

        {/* Current Stages */}
        <div className="px-4 mb-4">
          <p className="text-sm font-medium mb-2">Current Stages</p>
          <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col gap-2">
              {stages.map((stage, index) => (
                <DraggableStage
                  key={index}
                  index={index}
                  stage={stage}
                  moveStage={moveStage}
                  handleDeleteStage={handleDeleteStage}
                  handleEditStage={handleEditStage}
                />
              ))}
            </div>
          </DndProvider>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 px-4 pb-4">
          <Button variant="fgsoutline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
          >
           Update
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditTimelineModal;