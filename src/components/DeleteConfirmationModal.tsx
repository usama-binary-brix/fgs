import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import Button from "./ui/button/Button";

type DeleteConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: any;
  title: string
};

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  paddingY: '10px',
  overflowY: 'auto',
  borderRadius: 2,
};
const DeleteConfirmationModal = ({ open, onClose, onConfirm, name, title }: DeleteConfirmationModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>

      <Box>
        <div className=' border-b border-gray-400 mb-3 py-3 '>

          <div className='flex justify-between items-center px-4'>
            <p className='text-xl font-semibold'>Remove {title}</p>

            <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />

          </div>
        </div>



        <div className="px-4 py-2">
          <p>
            Are you sure you want to remove the {title} for <span className="text-primary">{name}</span>?
          </p>
        </div>
        <DialogActions>

          <div className='flex items-center gap-4'>
            <Button onClick={onClose} variant="fgsoutline"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="primary"
            >
              Remove
            </Button>
          </div>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
