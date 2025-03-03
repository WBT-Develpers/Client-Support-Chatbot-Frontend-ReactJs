import { X } from "lucide-react";
import { Button } from "../ui/button";

const ViewAnswerModal = ({
    isOpen,
    onClose,
    answer,
}: {
    isOpen: boolean;
    onClose: () => void;
    answer: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[100%] max-w-lg">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold">Full Answer</h2>
                    <X className="cursor-pointer" onClick={onClose} color="black" />
                </div>
                <div className="max-h-[400px] overflow-auto">
                    <p className="text-sm text-gray-700">{answer}</p>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose} className="bg-red-500 text-white">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ViewAnswerModal;