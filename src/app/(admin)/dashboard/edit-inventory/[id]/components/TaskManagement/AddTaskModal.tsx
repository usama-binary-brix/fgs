import MuiDatePicker from '@/components/CustomDatePicker';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Box, Grid, Modal, Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from '@/components/form/Select';

interface Props {
    open: boolean;
    onClose: () => void;
}

interface User {
    id: string;
    name: string;
    email: string;
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

const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
];

const priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
];

// Dummy users data - in a real app, this would come from your backend
const dummyUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com' },
];

const AddTaskModal: React.FC<Props> = ({ open, onClose }) => {
    const [userInput, setUserInput] = React.useState('');
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

    const filteredUsers = dummyUsers.filter(user =>
        user.name.toLowerCase().includes(userInput.toLowerCase()) ||
        user.email.toLowerCase().includes(userInput.toLowerCase())
    );

    const formik = useFormik({
        initialValues: {
            task_name: '',
            assigned_to: '',
            start_date: null,
            due_date: null,
            status: '',
            priority: '',
        },
        validationSchema: Yup.object({
            task_name: Yup.string().required('Task Name is required'),
            assigned_to: Yup.string().required('Assigned To is required'),
            start_date: Yup.date().required('Start Date is required'),
            due_date: Yup.date()
                .required('Due Date is required')
                .min(Yup.ref('start_date'), 'Due Date cannot be before Start Date'),
            status: Yup.string().required('Status is required'),
            priority: Yup.string().required('Priority is required'),
        }),
        onSubmit: (values) => {
            const submittedData = {
                ...values,
                assigned_to: selectedUser?.id || '', // Send user ID instead of name
            };
            console.log('Submitted Task Data:', submittedData);
            handleClose();
        },
    });

    const handleClose = () => {
        formik.resetForm();
        setUserInput('');
        setSelectedUser(null);
        onClose();
    };


    return (
        <Modal open={open} onClose={onClose}>
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
  <Autocomplete
    options={filteredUsers}
    getOptionLabel={(user) => `${user.name}`}
    inputValue={userInput}
    onInputChange={(_, newInputValue) => {
      setUserInput(newInputValue);
    }}
    onChange={(_, newValue) => {
      setSelectedUser(newValue);
      formik.setFieldValue('assigned_to', newValue?.id || '');
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Search user by name or email"
        error={formik.touched.assigned_to && Boolean(formik.errors.assigned_to)}
        helperText={formik.touched.assigned_to && formik.errors.assigned_to}
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
    value={selectedUser}
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

                        <Grid item xs={12} md={6}>
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

                        <Grid item xs={12} md={6}>
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
