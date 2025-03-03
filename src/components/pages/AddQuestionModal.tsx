import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '../ui/dialog';
import AddQuestionForm from './AddQuestionForm';
import { createFaq } from '@/services/QuestionServices';

interface AddQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialQuestion?: { category: string; question: string; answer: string, faqId: string, category_id: string, role_id: string };
}



const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
    isOpen,
    onClose,
    initialQuestion = { category: '', question: '', answer: '', faqId: '', category_id: '', role_id: '' },
}) => {

    const handleAddQuestion = async (data: any, actionType: string) => {
        try {
            const result: any = await createFaq(actionType, data, data?.faqId);
            if (result.statusCode === 201 || result.statusCode === 200) {
                onClose();
            }
        } catch (error) {
            console.error("Error adding question:", error);
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='min-w-[700px]' onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>{initialQuestion.question ? 'Edit Question' : 'Add Question'}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[600px] overflow-auto">
                    <div className="m-1">
                        <AddQuestionForm onSubmit={handleAddQuestion} initialQuestion={initialQuestion} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddQuestionModal;
