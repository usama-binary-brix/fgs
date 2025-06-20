import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import TextArea from "./form/input/TextArea";
import Button from "./ui/button/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import UpdateTaskStatusModal from "./UpdateTaskStatusModal";
import AddTaskModal from "@/app/(admin)/dashboard/edit-inventory/[id]/components/TaskManagement/AddTaskModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useDeleteTaskMutation } from "@/store/services/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

interface AssignedUser {
  first_name: string;
  avatar: string;
}

interface TaskAccordionProps {
  id?: any;
  title: string;
  assignedUsers?: any;
  startDate: string;
  dueDate: string;
  status: string;
  priority: string;
  initialDetails?: string;
  onSubmitTask?: (details: string) => void;
  onTaskDeleted?: (taskId: any) => void;
  statuses?:any
}

const TaskAccordion: React.FC<TaskAccordionProps> = ({
  id,
  title,
  assignedUsers,
  startDate,
  dueDate,
  status,
  priority,
  initialDetails = "",
  onSubmitTask,
  onTaskDeleted,
  statuses
}) => {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<any>(null);
  const [selectedUpdateTaskId, setSelectedUpdateTaskId] = useState<any>(null);
  const userType = useSelector((state: any) => state?.user?.user?.account_type)
  const [selectedTaskName, setSelectedTaskName] = useState("");

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleOpenModal = (id: any) => {
    setIsModalOpen(true);
    setSelectedUpdateTaskId(id)
  };

  const handleOpenTaskModal = (taskId: any) => {
    setIsTaskModalOpen(true);
    setSelectedTaskId(taskId);
  };

  const handleOpenDeleteModal = (taskId: any, taskName: string) => {
    setSelectedTaskId(taskId);
    setSelectedTaskName(taskName);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(selectedTaskId).unwrap();
      toast.success('Task deleted successfully!');
      if (onTaskDeleted) {
        onTaskDeleted(selectedTaskId); // Notify parent component about deletion
      }
    } catch (error) {
      toast.error('Failed to delete Task!');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedTaskId(null);
      setSelectedTaskName("");
    }
  };


  return (
    <>
      <div className="bg-white mb-2 rounded-md shadow-sm">
        <div className="flex items-center justify-between px-4 pt-1">
          <p className="text-base font-semibold mb-1">{title}</p>
          {assignedUsers && (
            <>
            <div className="flex items-center gap-1">
            <span className="text-[14px] text-[#616161] font-medium mr-1">
              Assigned to:
            </span>
            <div>
              <AvatarGroup>
                <Avatar
                  alt={`${assignedUsers.first_name}`}
                  src=''
                  sx={{ height: '2rem', width: '2rem' }}
                />
              </AvatarGroup>
              <p className="text-xs text-gray-500 text-center">{assignedUsers.first_name}</p>
            </div>
          </div>
            </>
          )}
          
        </div>

        <div className="px-4">
          <form>
            <Accordion
              disableGutters
              square
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                margin: 0,
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={<IoIosArrowDown />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  paddingX: 0,
                  paddingY: 0,
                  marginY: 0,
                  margin: 0,
                  minHeight: 'auto !important',
                  '& .MuiAccordionSummary-content': {
                    margin: '0 !important',
                    marginBottom: '10px !important',
                  },
                  '& .MuiAccordionSummary-content.Mui-expanded': {
                    margin: '0 !important',
                  },
                  '&.Mui-expanded': {
                    minHeight: 'auto !important',
                    margin: 0,
                  },
                }}
              >
                <div className="flex gap-4 flex-wrap my-0">
                  <span className="text-sm text-[#616161]">
                    Start Date: {startDate}
                  </span>
                  <span className="text-sm text-[#616161]">
                    Due Date: {dueDate}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[#616161]">
                    Status:
                    <span className={`px-2 py-0.5 capitalize rounded-full text-[11px] font-medium flex items-center gap-1 ${status === 'pending' ? 'bg-[#ECECEC] text-[#818181]' :
                      status === 'active' ? 'bg-[#F8EDDF] text-[#D18428]' :
                        'bg-green-100 text-green-600'
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${status === 'pending' ? 'bg-[#818181]' :
                        status === 'active' ? 'bg-[#D18428]' :
                          'bg-green-500'
                        }`}></span> {status}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[#616161]">
                    Priority:
                    <span className={`px-2 py-0.5 capitalize rounded-full text-[11px] font-medium flex items-center gap-1 ${priority === 'high' ? 'bg-red-100 text-red-600' :
                      priority === 'medium' ? 'bg-[#F8EDDF] text-[#D18428]' :
                        priority === 'low' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600' // default case if needed
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${priority === 'high' ? 'bg-red-500' :
                        priority === 'medium' ? 'bg-[#D18428]' :
                          priority === 'low' ? 'bg-green-500' :
                            'bg-gray-500' // default case if needed
                        }`}></span> {priority}
                    </span>
                  </span>

                </div>
              </AccordionSummary>

              <AccordionDetails sx={{ paddingX: 0 }}>
                <TextArea
                  placeholder="---"
                  rows={2}
                  value={initialDetails}
                />
                <div className="flex items-end justify-end flex-wrap">
                  {(userType == "super_admin" || userType == "admin") && (
                    <>
                      <Button
                        variant="danger"

                        onClick={() => handleOpenDeleteModal(id, title)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Task'}
                      </Button>
                      <Button
                        onClick={() => handleOpenTaskModal(id)}
                      >
                        Update Task
                      </Button>
                    </>
                  )}

                  {(userType == "super_admin" || userType == "admin" || userType == "employee") && (
                    <>
                      <Button
                        onClick={() => handleOpenModal(statuses.id)}
                      >
                        Update Task Status
                      </Button>

                    </>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          </form>
        </div>
      </div>

      <UpdateTaskStatusModal
        open={isModalOpen}
        onClose={handleCloseModal}
        taskName={title}
        taskId={selectedUpdateTaskId}

      />

      <AddTaskModal
        open={isTaskModalOpen}
        onClose={handleCloseModal}
        taskId={selectedTaskId}
      />

      <DeleteConfirmationModal
        title="Task"
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        name={selectedTaskName}
      />
    </>
  );
};

export default TaskAccordion;
