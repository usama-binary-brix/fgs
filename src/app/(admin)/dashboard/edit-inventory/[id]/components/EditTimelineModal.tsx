import React, { useCallback, useEffect, useState } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useParams } from 'next/navigation';
import { 
  useAddNewTimelineMutation, 
  useDeleteTimelineMutation, 
  useGetAllTimelineQuery, 
  useReorderTimelineMutation,
} from '@/store/services/api';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface TimelineStage {
  id: number;
  name: string;
  inventory_id: number;
  order: number;
  created_at: string;
  updated_at: string;
}

interface DraggableStageProps {
  stage: TimelineStage;
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
        <span>{stage.name}</span>
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

export const timelineModalStyles = {
  base: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg overflow-y-auto",
  sizes: {
    default: "w-[85%] sm:w-[50%] md:w-[50%] lg:w-[50%] max-h-[80vh] md:max-h-[90vh]",
    small: "w-[70%] sm:w-[60%] md:w-[70%] lg:w-[60%] max-h-[70vh]",
    large: "w-[78%] sm:w-[65%] md:w-[90%] lg:w-[85%] max-h-[90vh]"
  },
  header: "sticky top-0 z-10 bg-white border-b border-gray-400 py-3 px-4",
  content: "px-4 py-4 overflow-y-auto",
  title: "text-lg sm:text-xl font-semibold",
  closeButton: "cursor-pointer text-2xl sm:text-3xl text-gray-600 hover:text-gray-900"
} as const;

const EditTimelineModal: React.FC<Props> = ({ open, onClose }) => {
  const { id } = useParams();
  const [addNewTimeline, { isLoading: isAdding }] = useAddNewTimelineMutation();
  const [reorderTimeline] = useReorderTimelineMutation();

  const handleReorderSubmit = async () => {
    const reorderedStages = stages.map(stage => ({ id: stage.id }));
    try {
      await reorderTimeline({ stages: reorderedStages }).unwrap();
      toast.success("Stages reordered successfully");
      onClose(); // or refetch() if you want to refresh the data
    } catch (error) {
      console.error("Reorder failed:", error);
      toast.error("Failed to reorder stages");
    }
  };

  const { data: timelineData, error, isLoading: allTimelineLoading, refetch } = useGetAllTimelineQuery(id, {
    skip: !open
  });

  const [stages, setStages] = useState<TimelineStage[]>([]);
  const [newStage, setNewStage] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editStageValue, setEditStageValue] = useState('');

  // Update stages when data loads
  useEffect(() => {
    if (timelineData && timelineData.timeLine.length > 0) {
      setStages(timelineData.timeLine);
    }
  }, [timelineData]);

  const handleAddStage = async () => {
    if (!newStage.trim()) return;
    
    try {
      const response = await addNewTimeline({
        name: newStage.trim(),
        inventory_id: Number(id)
      }).unwrap();

      setStages([...stages, {
        id: response.id,
        name: newStage.trim(),
        inventory_id: Number(id),
        order: stages.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
      setNewStage('');
      toast.success(response.message);
    } catch (error) {
      toast.error('Failed to add stage');
      console.error('Error adding stage:', error);
    }
  };

  const handleUpdateStage = async () => {
    if (editingIndex === null || !editStageValue.trim()) return;
    
    const stageToUpdate = stages[editingIndex];
    
    try {
    const response = await addNewTimeline({
        timeline_id: stageToUpdate.id,
        name: editStageValue.trim(),
        inventory_id: Number(id)
      }).unwrap();

      const updatedStages = [...stages];
      updatedStages[editingIndex] = {
        ...updatedStages[editingIndex],
        name: editStageValue.trim(),
        updated_at: new Date().toISOString()
      };
      setStages(updatedStages);
      setEditingIndex(null);
      setEditStageValue('');
      toast.success(response.message);
    } catch (error) {
      toast.error('Failed to update stage');
      console.error('Error updating stage:', error);
    }
  };

    const [deleteTimeline, { isLoading: isDeleting }] = useDeleteTimelineMutation();

    const handleDeleteStage = async (index: number) => {
      const stageToDelete = stages[index];
      
      try {
        const response = await deleteTimeline(stageToDelete.id).unwrap();
        
        const updatedStages = [...stages];
        updatedStages.splice(index, 1);
        setStages(updatedStages);
        
        if (editingIndex === index) {
          setEditingIndex(null);
          setEditStageValue('');
        }
        
        toast.success(response.message || "Stage deleted successfully");
      } catch (error) {
        toast.error('Failed to delete stage');
        console.error('Error deleting stage:', error);
      }
    };
    
  

  const handleEditStage = (index: number) => {
    setEditingIndex(index);
    setEditStageValue(stages[index].name);
  };

  const moveStage = (fromIndex: number, toIndex: number) => {
    const updatedStages = [...stages];
    const [movedStage] = updatedStages.splice(fromIndex, 1);
    updatedStages.splice(toIndex, 0, movedStage);
    setStages(updatedStages);
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

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditStageValue('');
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 9999 }}>
       <Box className={`${timelineModalStyles.base} ${timelineModalStyles.sizes.default}`}>
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
          <div className="flex gap-2 w-full">
            <div className='w-full'>
              <Input
                placeholder="Enter Stage Name"
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
                  // loading={isUpdating}
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
                className='h-9 w-40 md:w-30'
                variant="primary"
                onClick={handleAddStage}
                // loading={isAdding}
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
                  key={stage.id}
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
            onClick={handleReorderSubmit}
          >
            Update Order
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditTimelineModal;