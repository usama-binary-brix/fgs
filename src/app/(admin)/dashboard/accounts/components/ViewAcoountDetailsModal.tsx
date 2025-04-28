import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { FaUserCircle } from "react-icons/fa";
import Image from 'next/image';
import { useSingleUserQuery } from '@/store/services/api';
import { RxCross2 } from 'react-icons/rx';
import { useState } from 'react';
import UserProjects from './UserProjects';
import AccountsModal from './AccountsModal';
import Button from '@/components/ui/button/Button';
import { useSelector } from 'react-redux';

interface ViewMoreModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | number | null;
}

const ViewAccountDetailsModal: React.FC<ViewMoreModalProps> = ({ open, onClose, userId }) => {
  const { data: user, isLoading, error } = useSingleUserQuery(userId, { skip: !userId });

  const [selectedUserData, setSelectedUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const userRole = useSelector((state:any)=>state?.user?.user?.account_type)

  const handleEditUser = (user: any) => {
    setSelectedUserData(user);
    onClose()
    setIsEditModalOpen(true);

  };

  return (
    <>

      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" >
        <DialogTitle sx={{ borderBottom: '1px solid gray' }}>
          <div className='flex justify-between items-center'>
            <p className='text-xl font-semibold'>Accounts Details</p>

            <div>
              <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />

            </div>

          </div>
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Typography>Loading user details...</Typography>
          ) : error ? (
            <Typography color="error">Failed to load user details.</Typography>
          ) : (
            user?.user && (
              <div className="flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-5 gap-8 text-gray-700 text-sm">
                  <div>
                    <p className="text-gray-500">Account Type</p>
                    <p className="font-medium text-[#616161] mt-1">{user?.user.account_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">First Name</p>
                    <p className="font-medium break-words max-w-[100px] overflow-hidden text-ellipsis text-[#616161] mt-1">{user?.user.first_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Name</p>
                    <p className="font-medium break-words max-w-[100px] overflow-hidden text-ellipsis text-[#616161] mt-1">{user?.user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium break-words max-w-[150px] overflow-hidden text-ellipsis text-[#616161] mt-1">{user?.user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-[#616161] mt-1">{user?.user.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Company</p>
                    <p className="font-medium text-[#616161] mt-1">{user?.user.company_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Referred By</p>
                    <p className="font-medium text-[#616161] mt-1">{user?.user.reffer_by || "---"}</p>
                  </div>
                </div>
              </div>
            )
          )}

          {user?.user?.account_type === 'investor' && (
            <>
          <div className='mt-4'>
            <UserProjects user={user}/>

          </div>        
            
            </>
          )}
          </DialogContent>
        <DialogActions sx={{ paddingBottom: '1rem', paddingRight: '1rem' }}>



          <Button onClick={onClose} variant="fgsoutline"

          >
            Close
          </Button>
          <Button
            onClick={() => handleEditUser(user?.user)}
            // type="submit"
            variant="primary"
          >
            Edit Account
          </Button>
        </DialogActions>
      </Dialog>

      <AccountsModal open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={selectedUserData} />

    </>
  );
};

export default ViewAccountDetailsModal;
