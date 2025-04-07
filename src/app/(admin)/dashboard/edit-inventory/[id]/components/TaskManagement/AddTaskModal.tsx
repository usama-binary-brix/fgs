import MuiDatePicker from '@/components/CustomDatePicker';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Box, Grid, Modal } from '@mui/material';
import React from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from '@/components/form/Select';

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

const options = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
];

const AddTaskModal: React.FC<Props> = ({ open, onClose }) => {
    const formik = useFormik({
        initialValues: {
            task_name: '',
            assigned_to: '',
            start_date: null,
            due_date: null,
            status: '',
        },
        validationSchema: Yup.object({
            task_name: Yup.string().required('Task Name is required'),
            assigned_to: Yup.string().required('Assigned To is required'),
            start_date: Yup.date().required('Start Date is required'),
            due_date: Yup.date()
                .required('Due Date is required')
                .min(Yup.ref('start_date'), 'Due Date cannot be before Start Date'),
            status: Yup.string().required('Status is required'),
        }),
        onSubmit: (values) => {
            console.log('Submitted Task Data:', values);
            onClose();
        },
    });

    return (
        <Modal open={open} onClose={onClose} >
            <Box sx={modalStyle}>
                <div className='border-b border-gray-400 mb-3 py-3'>
                    <div className='flex justify-between items-center px-4'>
                        <p className='text-xl font-semibold'>Add New Task</p>
                        <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} autoComplete='off' className='px-4'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
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

                        <Grid item xs={12} md={6}>
                            <Label>
                                Assigned To <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter Assigned To"
                                type="text"
                                {...formik.getFieldProps('assigned_to')}
                            />
                            {formik.touched.assigned_to && formik.errors.assigned_to && (
                                <p className="text-error-500 text-sm">{formik.errors.assigned_to}</p>
                            )}
                        </Grid>

                        <Grid item xs={6} md={4}>
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

                        <Grid item xs={6} md={4}>
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

                        <Grid item xs={12} md={4}>
                            <Label>Status <span className="text-error-500">*</span></Label>
                            <Select
                                name="status"
                                value={formik.values.status}
                                options={options}
                                onChange={(e) => formik.setFieldValue('status', e.target.value)}
                                onBlur={formik.handleBlur}
                                error={formik.touched.status && formik.errors.status}
                            />
                            {formik.touched.status && formik.errors.status && (
                                <p className="text-error-500 text-sm">{formik.errors.status}</p>
                            )}
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <div className='flex items-center gap-4'>
                                <Button onClick={onClose} variant="fgsoutline">Cancel</Button>
                                <Button type="submit" variant="primary">Add Task</Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default AddTaskModal;
