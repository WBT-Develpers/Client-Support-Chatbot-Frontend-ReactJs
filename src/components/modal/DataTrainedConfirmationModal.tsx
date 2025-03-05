import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '../ui/dialog';
import { Button } from '../ui/button';
import Lottie from "lottie-react";
import SuccessAnimation from '../../assets/succes_animation.json';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const DataTrainedConfirmationModal: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onContinue }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className='w-full flex flex-col justify-center items-center -mt-10'>
                    <Lottie animationData={SuccessAnimation} loop={true} style={{ width: 200, height: 200 }} />
                    <span className='-mt-5 text-xl'>{"Your data has been trained successfully!"}</span>
                </div>
                <DialogFooter className='mt-5'>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="destructive" onClick={onContinue} className='bg-blue-600 hover:bg-blue-500'>
                        Add More
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DataTrainedConfirmationModal