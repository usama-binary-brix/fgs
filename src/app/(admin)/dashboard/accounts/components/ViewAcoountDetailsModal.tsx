import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { FaUserCircle } from "react-icons/fa";
import Image from 'next/image';
import { useSingleUserQuery } from '@/store/services/api';
import { RxCross2 } from 'react-icons/rx';

interface ViewMoreModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | number | null;
}

const ViewAccountDetailsModal: React.FC<ViewMoreModalProps> = ({ open, onClose, userId }) => {
  const { data: user, isLoading, error } = useSingleUserQuery(userId, { skip: !userId });
console.log(user, 'single user data')

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{borderBottom:'1px solid gray'}}>
<div className='flex justify-between items-center'>
<p>Accounts Details</p>
    <div>
        <RxCross2 onClick={onClose} className='cursor-pointer text-3xl'/>
        
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
            <div className="grid grid-cols-4 gap-8 text-gray-700 text-sm">
              <div>
                <p className="text-gray-500">Account Type</p>
                <p className="font-semibold">{user?.user.account_type}</p>
              </div>
              <div>
                <p className="text-gray-500">First Name</p>
                <p className="font-semibold">{user?.user.first_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Name</p>
                <p className="font-semibold">{user?.user.last_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">{user?.user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-semibold">{user?.user.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-500">Company</p>
                <p className="font-semibold">{user?.user.company_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Referred By</p>
                <p className="font-semibold">{user?.user.reffer_by || "---"}</p>
              </div>
            </div>
          </div>
          )
        )}
      </DialogContent>
      <DialogActions>
 <Button onClick={onClose} variant="outlined" sx={{ mr: 2, textTransform:'none' }}>
                Close
              </Button>
              <Button
                // type="submit"
                variant="contained"
                sx={{ backgroundColor: '#C28024', '&:hover': { backgroundColor: '#a56a1d' }, textTransform:'none' }}
              >
            Edit Account
              </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAccountDetailsModal;
