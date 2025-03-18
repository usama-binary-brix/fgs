'use client'
import TopButtons from '@/components/Buttons/TopButtons';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { Modal, Box, Typography, TextField, Button, Grid, IconButton } from '@mui/material';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  reminderDate: string;
  budget: string;
  condition: string;
  assignedTo: string;
  image: string;
}

const leadsData: Lead[] = [
  { id: 'L0001', name: 'John', email: 'johndoe@example.com', company: 'PDSN LLC', source: 'Referral', reminderDate: '01-01-23 at 12:00 AM', budget: '$500.00', condition: 'New', assignedTo: 'Arcangelo', image: '/images/user/user-1.jpg' },
  { id: 'L0004', name: 'Alex', email: 'alexsmith@example.com', company: 'Three Sticks Marketing', source: 'Website', reminderDate: '15-03-24 at 3:30 AM', budget: '$300.00', condition: 'Old', assignedTo: 'Myron', image: '/images/user/user-2.jpg' },
  { id: 'L0006', name: 'Jane', email: 'janedoe@example.com', company: 'Credible Holdings', source: 'Referral', reminderDate: '22-07-25 at 6:45 PM', budget: '$700.00', condition: 'New/Old', assignedTo: 'Myron', image: '/images/user/user-3.jpg' },
];

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AccountsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    source: '',
    reminderDate: '',
    budget: '',
    condition: '',
    assignedTo: '',
    phone: '',
    address: '',
  });

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = () => {
    console.log('New Account Data:', formData);
    // Add submission logic here
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="inline-flex items-center gap-3">
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="text-xs border rounded-lg pl-9 pr-2 h-9 w-64 border-gray-300 focus:border-gray-400 focus:outline-none"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TopButtons label="Edit Columns" variant="outlined" />
          <TopButtons label="Filters" variant="outlined" />
          <TopButtons label="Add New Account" variant="primary" onClick={() => setModalOpen(true)} />
        </div>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Add New Account</Typography>
            <IconButton onClick={() => setModalOpen(false)}>
X
            </IconButton>
          </div>

          <Grid container spacing={2}>
            {[
              { label: 'Name', name: 'name' },
              { label: 'Email', name: 'email' },
              { label: 'Company', name: 'company' },
              { label: 'Source', name: 'source' },
              { label: 'Reminder Date', name: 'reminderDate' },
              { label: 'Budget', name: 'budget' },
              { label: 'Condition', name: 'condition' },
              { label: 'Assigned To', name: 'assignedTo' },
              { label: 'Phone', name: 'phone' },
              { label: 'Address', name: 'address' },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  label={field.label}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            ))}
          </Grid>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="outlined" onClick={handleModalSubmit}>Submit</Button>
          </div>
        </Box>
      </Modal>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['ID', 'Name', 'Email', 'Company', 'Source', 'Reminder Date', 'Budget', 'Condition', 'Assigned To', 'Action'].map((heading) => (
                  <TableCell key={heading} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">{heading}</TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {leadsData.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="px-5 py-4 text-xs">{lead.id}</TableCell>
                  <TableCell className="px-5 py-4 text-xs flex items-center gap-3">
                    <Image width={40} height={40} src={lead.image} alt={lead.name} className="rounded-full" />
                    <span>{lead.name}</span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.email}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.company}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.source}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.reminderDate}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.budget}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.condition}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.assignedTo}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">
                    <div className="relative inline-block">
                      <button onClick={toggleDropdown} className="dropdown-toggle">
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>
                      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
                        <DropdownItem onItemClick={closeDropdown}>View More</DropdownItem>
                        <DropdownItem onItemClick={closeDropdown}>Delete</DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default AccountsTable;
