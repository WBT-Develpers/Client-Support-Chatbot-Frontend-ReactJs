// src/components/FileUploadUI.jsx
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ClockLoader from "react-spinners/ClockLoader";

const FileUpload = ({ onUpload, fileLoader }: { onUpload: (file: File) => void, fileLoader: boolean }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setFile(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            onUpload(file);
            setFile(null);
        }
    };

    return (
        <Card className="bg-white text-black">
            <CardContent>
                <div className="space-y-4 mt-3">
                    <p className="text-base text-black font-medium">
                        Upload documents to enhance chatbot accuracy with your content.
                    </p>
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? "border-indigo-500 bg-indigo-900" : "border-gray-300"}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <p className="text-sm text-gray-400">
                            Drag & drop or {" "}
                            <label htmlFor="file-upload" className="text-indigo-400 cursor-pointer">
                                choose file
                            </label>{" "}
                            to upload
                        </p>
                        <span className="mt-3 text-xs text-gray-400">Supported formats: .pdf, .docx, .xlsx, .txt, .csv</span>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.txt,.md,.mp3"
                        />
                        {file && (
                            <p className="mt-2 text-sm text-gray-400">
                                Selected file: <span className="font-medium text-indigo-400">{file.name}</span>
                            </p>
                        )}
                    </div>
                    <Button onClick={handleSubmit} disabled={!file || fileLoader} className="bg-blue-600 hover:bg-blue-500 text-white">
                        {fileLoader ? 'Training...' : "Train File"}
                        {fileLoader && (
                            <ClockLoader
                                color={'white'}
                                loading={fileLoader}
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default FileUpload;