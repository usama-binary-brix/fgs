import MuiDatePicker from '@/components/CustomDatePicker';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Box, Grid, Modal, Autocomplete, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from '@/components/form/Select';
import { useParams } from 'next/navigation';
import { useAddNewTaskMutation, useGetAllEmployeesQuery, useGetAllTimelineQuery, useGetTaskByIdQuery, useUpdateTaskMutation } from '@/store/services/api';
import { ErrorResponse } from '@/app/(admin)/dashboard/accounts/components/AccountsModal';
import { toast } from 'react-toastify';
import TextArea from '@/components/form/input/TextArea';

interface Props {
    open: boolean;
    onClose: () => void;
    taskId?: string | null;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface Timeline {
    id: string;
    name: string;
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

export const taskModalStyles = {
    base: "absolute pb-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg overflow-y-auto",
    sizes: {
        default: "w-[85%] sm:w-[60%] md:w-[60%] lg:w-[50%] max-h-[80vh] md:max-h-[90vh]",

    },
    header: "sticky top-0 z-10 bg-white border-b border-gray-400 py-3 px-4",
    content: "px-4 py-4 overflow-y-auto",
    title: "text-lg sm:text-xl font-semibold",
    closeButton: "cursor-pointer text-2xl sm:text-3xl text-gray-600 hover:text-gray-900"
} as const;





const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
];

const priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
];

const AddTaskModal: React.FC<Props> = ({ open, onClose, taskId }) => {
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [userInput, setUserInput] = React.useState('');
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [selectedTimeline, setSelectedTimeline] = React.useState<Timeline | null>(null);

    // API hooks
    const [addTask] = useAddNewTaskMutation();
    const [editTask] = useUpdateTaskMutation();
    const { data: taskData, error: taskError, isLoading: taskLoading, refetch: taskRefetch } = useGetTaskByIdQuery(taskId, { skip: !taskId });
    const { data: timelineData, error: timelineError, isLoading: allTimelineLoading, refetch: timelineRefetch } = useGetAllTimelineQuery(id);
    const { data, error, isFetching, refetch } = useGetAllEmployeesQuery(undefined, {
        skip: !open,
        refetchOnMountOrArgChange: true,
    });


    React.useEffect(() => {
        if (open) {
            refetch();
            timelineRefetch();
            if (taskId) {
                setIsEditMode(true);
                taskRefetch();
            } else {
                setSelectedUser(null);
                setSelectedTimeline(null);
                formik.resetForm();
                setIsEditMode(false);
            }
        }
    }, [open, refetch, timelineRefetch, taskId, taskRefetch]);

    // Set form data when taskData changes (edit mode)
    React.useEffect(() => {
        if (taskData?.task && isEditMode) {
            const task = taskData.task;
            formik.setValues({
                task_name: task.task_name || '',
                employee_id: task.employee_id || '',
                timeline_id: task.timeline_id || '',
                start_date: task.start_date || null,
                due_date: task.due_date || null,
                status: task.status || '',
                priority: task.priority || '',
                task_description: task.task_description || '',
            });

            // Find and set the selected user
            const user = backendUsers.find((u: User) => u.id === task.employee_id);
            if (user) setSelectedUser(user);

            // Find and set the selected timeline
            const timeline = timelineOptions.find((t: Timeline) => t.id === task.timeline_id);
            if (timeline) setSelectedTimeline(timeline);
        }
    }, [taskData, isEditMode]);

    const backendUsers = React.useMemo(() => {
        return data?.employee?.map((emp: any) => ({
            id: emp.id,
            name: `${emp?.first_name || ''}${emp?.last_name ? ' ' + emp.last_name : ''}`.trim(),
            email: emp?.email || ''
        })) || [];
    }, [data?.employee]);

    const timelineOptions = React.useMemo(() => {
        return timelineData?.timeLine?.map((timeline: any) => ({
            id: timeline.id,
            name: timeline.name || `Timeline ${timeline.id}`
        })) || [];
    }, [timelineData?.timeLine]);

    const filteredUsers = React.useMemo(() => {
        return backendUsers.filter((user: any) =>
            user.name.toLowerCase().includes(userInput.toLowerCase())
        );
    }, [backendUsers, userInput]);

    const formik = useFormik({
        initialValues: {
            task_name: '',
            employee_id: '',
            timeline_id: '',
            start_date: null,
            due_date: null,
            status: '',
            priority: '',
            task_description: '',
        },
        validationSchema: Yup.object({
            task_name: Yup.string().required('Task Name is required'),
            employee_id: Yup.string().required('Assigned To is required'),
            timeline_id: Yup.string().required('Timeline is required'),
            start_date: Yup.date().required('Start Date is required'),
            due_date: Yup.date()
                .required('Due Date is required')
                .min(Yup.ref('start_date'), 'Due Date cannot be before Start Date'),
            status: Yup.string().required('Status is required'),
            priority: Yup.string().required('Priority is required'),
            task_description: Yup.string().required('Task Description is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const submittedData = {
                ...values,
                employee_id: selectedUser?.id || '',
                timeline_id: selectedTimeline?.id || '',
                inventory_id: id
            };

            try {
                let response;
                if (isEditMode && taskId) {
                    // Edit existing task
                    response = await editTask({ task_id: taskId, ...submittedData }).unwrap();
                    toast.success(response.message || 'Task updated successfully');
                } else {
                    // Add new task
                    response = await addTask(submittedData).unwrap();
                    toast.success(response.message || 'Task created successfully');
                }
                resetForm();
                onClose();
            } catch (error) {
                const errorResponse = error as ErrorResponse;
                if (errorResponse?.data?.error) {
                    Object.values(errorResponse.data.error).forEach((errorMessage) => {
                        if (Array.isArray(errorMessage)) {
                            errorMessage.forEach((msg) => toast.error(msg));
                        } else {
                            toast.error(errorMessage);
                        }
                    });
                }
                handleClose();
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        setUserInput('');
        setSelectedUser(null);
        setIsEditMode(false);
        setSelectedTimeline(null);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={`${taskModalStyles.base} ${taskModalStyles.sizes.default}`}>
                <div className='border-b border-gray-400 mb-3 py-3'>
                    <div className='flex justify-between items-center px-4'>
                        <p className='text-xl font-semibold'>
                            {isEditMode ? 'Edit Task' : 'Add New Task'}
                        </p>
                        <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} autoComplete='off' className='px-4'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Label>
                                Select Timeline <span className="text-error-500">*</span>
                            </Label>
                            <Autocomplete
                                options={timelineOptions}
                                getOptionLabel={(timeline) => timeline.name}
                                onChange={(_, newValue) => {
                                    setSelectedTimeline(newValue);
                                    formik.setFieldValue('timeline_id', newValue?.id || '');
                                }}
                                value={selectedTimeline}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select Timeline"
                                        error={formik.touched.timeline_id && Boolean(formik.errors.timeline_id)}
                                        helperText={formik.touched.timeline_id && formik.errors.timeline_id}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '36px',
                                                paddingTop: '6px',
                                                paddingBottom: '6px',
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: '6px 12px',
                                            },
                                        }}
                                    />
                                )}
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        padding: '0px 9px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label>
                                Task Name <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter Task Name"
                                type="text"
                                {...formik.getFieldProps('task_name')}
                            />
                            {formik.touched.task_name && formik.errors.task_name && (
                                <p className="text-error-500 text-sm">{formik.errors.task_name}</p>
                            )}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label>
                                Assigned To <span className="text-error-500">*</span>
                            </Label>
                            <Autocomplete
                                options={filteredUsers}
                                getOptionLabel={(user) => `${user.name}`}
                                inputValue={userInput}
                                onInputChange={(_, newInputValue) => {
                                    setUserInput(newInputValue);
                                }}
                                onChange={(_, newValue) => {
                                    setSelectedUser(newValue);
                                    formik.setFieldValue('employee_id', newValue?.id || '');
                                }}
                                value={selectedUser}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search Employee by name"
                                        error={formik.touched.employee_id && Boolean(formik.errors.employee_id)}
                                        helperText={formik.touched.employee_id && formik.errors.employee_id}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '36px',
                                                paddingTop: '6px',
                                                paddingBottom: '6px',
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: '6px 12px',
                                            },
                                        }}
                                    />
                                )}
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        padding: '0px 9px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={6}>
                            <Label>Start Date <span className="text-error-500">*</span></Label>
                            <MuiDatePicker
                                name="start_date"
                                value={formik.values.start_date}
                                onChange={(value) => formik.setFieldValue('start_date', value)}
                            />
                            {formik.touched.start_date && formik.errors.start_date && (
                                <p className="text-error-500 text-sm">{formik.errors.start_date}</p>
                            )}
                        </Grid>

                        <Grid item xs={6} md={6}>
                            <Label>Due Date <span className="text-error-500">*</span></Label>
                            <MuiDatePicker
                                name="due_date"
                                value={formik.values.due_date}
                                onChange={(value) => formik.setFieldValue('due_date', value)}
                            />
                            {formik.touched.due_date && formik.errors.due_date && (
                                <p className="text-error-500 text-sm">{formik.errors.due_date}</p>
                            )}
                        </Grid>

                        <Grid item xs={6} md={6}>
                            <Label>Status <span className="text-error-500">*</span></Label>
                            <Select
                                name="status"
                                value={formik.values.status}
                                options={statusOptions}
                                onChange={(e) => formik.setFieldValue('status', e.target.value)}
                                onBlur={formik.handleBlur}
                                error={formik.touched.status && Boolean(formik.errors.status)}
                            />
                            {formik.touched.status && formik.errors.status && (
                                <p className="text-error-500 text-sm">{formik.errors.status}</p>
                            )}
                        </Grid>

                        <Grid item xs={6} md={6}>
                            <Label>Priority <span className="text-error-500">*</span></Label>
                            <Select
                                name="priority"
                                value={formik.values.priority}
                                options={priorityOptions}
                                onChange={(e) => formik.setFieldValue('priority', e.target.value)}
                                onBlur={formik.handleBlur}
                                error={formik.touched.priority && Boolean(formik.errors.priority)}
                            />
                            {formik.touched.priority && formik.errors.priority && (
                                <p className="text-error-500 text-sm">{formik.errors.priority}</p>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Task Description <span className="text-error-500">*</span></Label>
                            <TextArea
                                placeholder="Enter your note"
                                rows={3}
                                value={formik.values.task_description}
                                onChange={(value) => formik.setFieldValue("task_description", value)}
                                onBlur={() => formik.setFieldTouched("task_description", true)}
                                error={formik.touched.task_description && Boolean(formik.errors.task_description)}
                                hint={formik.touched.task_description ? formik.errors.task_description : ""}
                                disabled={formik.isSubmitting}
                            />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <div className='flex items-center gap-4'>
                                <Button onClick={handleClose} variant="fgsoutline">Cancel</Button>
                                <Button type="submit" variant="primary">
                                    {isEditMode ? 'Update Task' : 'Add Task'}
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default AddTaskModal;
