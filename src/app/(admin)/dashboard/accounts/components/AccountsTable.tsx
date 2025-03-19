'use client'
import TopButtons from '@/components/Buttons/TopButtons';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import AccountsModal from './AccountsModal';
import { useDeleteUserMutation, useGetAllUsersQuery } from '@/store/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { format } from "date-fns";
import { FaUserCircle } from "react-icons/fa";
import ViewAccountDetailsModal from './ViewAcoountDetailsModal';
import EditAccount from './EditAccount';

const AccountsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useGetAllUsersQuery('');
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [selectedUserData, setSelectedUserData] = useState(null);

const handleEditUser = (user: any) => {
  setSelectedUserData(user);
  setIsEditModalOpen(true);
};

    const toggleDropdown = (id:string | number | null) => {
  if (openDropdownId === id) {
    setOpenDropdownId(null); 
  } else {
    setOpenDropdownId(id); 
  }
};
const handleViewMore = (userId: string | number) => {
  setSelectedUserId(userId);
  setIsViewMoreOpen(true);
};


  
    function closeDropdown() {
      setIsOpen(false);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const handleDeleteUser = async (userId:string | number | null) => {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete user!');
      } finally {
        setIsDeleteModalOpen(false); 
      }
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
     <TopButtons label="Add New Account" variant="primary" onClick={handleOpenModal} />
 
      <AccountsModal open={isModalOpen} onClose={handleCloseModal} />
   </div>
</div>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
      <Table>
  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
    <TableRow>
      {['Name', 'Email', 'Account Type', 'Phone Number', 'Date Created', 'Status', 'Action'].map((heading) => (
        <TableCell key={heading} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {heading}
        </TableCell>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
    {data?.users.map((user:any, index:any) => (
      <TableRow key={index}>
        <TableCell className="px-5 py-4 text-xs flex items-center gap-3">
  {user.image ? (
    <Image
      width={32}
      height={32}
      src={user.image}
      alt={user.first_name}
      className="rounded-full"
    />
  ) : (
<span>
<FaUserCircle className="w-6 h-6 text-gray-500" />

</span>
)}

          <span className="font-medium">{user.first_name} {user.last_name}</span>
        </TableCell>

        <TableCell className="px-5 py-4 text-xs">{user.email}</TableCell>
        <TableCell className="px-5 py-4 text-xs">{user.account_type}</TableCell>
        <TableCell className="px-5 py-4 text-xs">{user.phone_number}</TableCell>
        <TableCell className="px-5 py-4 text-xs">
  {format(new Date(user.created_at), "dd-MM-yy")}
</TableCell>
        <TableCell className="px-5 py-4 text-xs">
          <span
            className={`px-2 py-1 rounded-sm text-sm font-medium ${
              user.status === 'Active'
                ? 'bg-green-100 px-3 text-green-600'
                : 'bg-orange-100 text-orange-500'
            }`}
          >
            {user.status}
          </span>
        </TableCell>

        <TableCell className="px-5 py-4 text-xs">
          <div className="relative inline-block">
          <button onClick={() => toggleDropdown(user.id)} className="dropdown-toggle">
  <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
</button>

<Dropdown isOpen={openDropdownId === user.id} onClose={() => setOpenDropdownId(null)} className="w-40 p-2">
<DropdownItem
  onItemClick={() => handleViewMore(user.id)}
  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
>
  View
</DropdownItem>
<DropdownItem
  onItemClick={() => handleEditUser(user)} // Call function with user data
  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
>
  Edit
</DropdownItem>

              <DropdownItem
  onItemClick={() => {
    setOpenDropdownId(null);
    setSelectedUserId(user.id);
    setIsDeleteModalOpen(true); 
  }}
  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
>
  Delete
</DropdownItem>

            </Dropdown>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      </div>
    </div>


    <Dialog
  open={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
>
  <DialogTitle>Remove Account</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to remove account for user name </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setIsDeleteModalOpen(false)} color="primary" sx={{ textTransform:'none'}}>
      Cancel
    </Button>
    <Button
    className='bg-primary hover:bg-primary'
      onClick={() => handleDeleteUser(selectedUserId)}
      // color="error"
      sx={{backgroundColor:'primary',  '&:hover': { backgroundColor: 'primary' }, textTransform:'none'}}
      variant="contained"
    >
      Remove
    </Button>
  </DialogActions>
</Dialog>
<ViewAccountDetailsModal open={isViewMoreOpen} onClose={() => setIsViewMoreOpen(false)} userId={selectedUserId} />
<EditAccount   open={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  userData={selectedUserData} />


   </>
  );
};

export default AccountsTable;
