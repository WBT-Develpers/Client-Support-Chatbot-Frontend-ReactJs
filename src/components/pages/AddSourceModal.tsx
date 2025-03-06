import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import FileUpload from './FileUpload';
import LinkUrl from './LinkUrl';
import { toast } from '@/hooks/use-toast';
import { getCategoriesByRoles } from '@/services/CategoryServices';
import { getRoles } from '@/services/RoleService';
import { categorizeAlltheDocuments, trainFiles, trainLinks } from '@/services/TrainedDataServices';
import DataTrainedConfirmationModal from '../modal/DataTrainedConfirmationModal';

interface AddSourcesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Category {
    _id: string;
    name: string;
}

interface Role {
    _id: string;
    name: string;
    login_name: string;
    created_at: Date;
    updated_at: Date;
}

const AddSourceModal: React.FC<AddSourcesModalProps> = ({
    isOpen,
    onClose,
}) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState<string | null>('all');
    const [link, setLink] = useState<string>('');
    const [linkLoader, setLinkLoader] = useState(false);
    const [fileLoader, setFileLoader] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [roleId, setRoleId] = useState<string | null>(userData?.role === 'admin' ? 'all' : userData?._id || '');
    const [confirmModal, setConfirmModal] = useState(false);

    useEffect(() => {
        if (roleId !== 'all') {
            fetchCategories();
        }
        if (userData?.role === 'admin') {
            fetchRoles();
        }
    }, [roleId])

    const fetchCategories = async () => {
        try {
            const response: any = await getCategoriesByRoles(roleId || 'all');
            if (response.statusCode === 200) {
                setCategories(response?.categories);
            } else {
                console.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    const fetchRoles = async () => {
        try {
            const response: any = await getRoles();
            if (response.statusCode === 200) {
                setRoles(response?.roles);
            } else {
                console.error("Failed to fetch roles");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setFileLoader(true);
            if (categoryId !== 'all') {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("category_id", categoryId || '');
                formData.append('admin_id', userData?.role === 'admin' ? 'admin' : userData?._id || '');
                formData.append('role_id', userData?.role === 'admin' ? roleId || '' : userData?._id || '');
                const response: any = await trainFiles(formData);
                if (response.statusCode === 200) {
                    const categorize: any = await categorizeAlltheDocuments(categoryId);
                    if (categorize.statusCode === 200) {
                        // toast({
                        //     title: "Success",
                        //     description: response.message,
                        //     variant: "default",
                        // })
                        // onClose();
                        setConfirmModal(true);
                        setFileLoader(false);
                    } else {
                        toast({
                            title: "Error",
                            description: categorize.message,
                            variant: "destructive",
                        })
                        setFileLoader(false);
                    }
                } else {
                    toast({
                        title: "Error",
                        description: response.message,
                        variant: "destructive",
                    })
                    setFileLoader(false);
                }
            } else {
                setFileLoader(false);
                alert("Category ID not provided");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setFileLoader(false);
        }
    };

    const handleLinkUpload = async () => {
        try {
            setLinkLoader(true);
            if (categoryId !== 'all') {
                const dataToSend = {
                    link_url: link,
                    category_id: categoryId,
                    admin_id: userData?.role === 'admin' ? 'admin' : userData?._id || '',
                    role_id: userData?.role === 'admin' ? roleId || '' : userData?._id || ''
                }
                const response: any = await trainLinks(dataToSend);
                if (response.statusCode === 200) {
                    const categorize: any = await categorizeAlltheDocuments(categoryId);
                    if (categorize.statusCode === 200) {
                        setConfirmModal(true);
                        setLinkLoader(false)
                        // toast({
                        //     title: "Success",
                        //     description: response.message,
                        //     variant: "default",
                        // })
                        // onClose();
                    } else {
                        setLinkLoader(false)
                        toast({
                            title: "Error",
                            description: categorize.message,
                            variant: "destructive",
                        })
                    }
                } else {
                    setLinkLoader(false)
                    toast({
                        title: "Error",
                        description: response.message,
                        variant: "destructive",
                    })
                }
            } else {
                console.error("Category ID not provided");
                setLinkLoader(false)
                alert("Category ID not provided");
            }
        } catch (error) {
            console.error("Error uploading link:", error);
            setLinkLoader(false)
        }
    };


    const onCloseConfirmModal = (value: string) => {
        if (value === 'yes') {
            setConfirmModal(false);
        } else {
            onClose();
            setConfirmModal(false);
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {
                confirmModal && (
                    <DataTrainedConfirmationModal isOpen={confirmModal} onClose={() => onCloseConfirmModal('no')} onContinue={() => onCloseConfirmModal('yes')} />
                )
            }
            <DialogContent className='min-w-[800px] bg-white p-10 text-black'>
                <DialogHeader>
                    <DialogTitle className='text-black text-2xl'>{'Upload Source Documents'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-5">
                    <Card className="border-0">

                        {
                            userData?.role === 'admin' && (
                                <div className="px-6 pt-5">
                                    <Select onValueChange={(value) => setRoleId(value || null)}>
                                        <SelectTrigger className="w-full bg-white text-black">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="all" className="text-black">All Roles</SelectItem>
                                            {roles?.map((role) => (
                                                <SelectItem key={role._id} value={role._id} className="text-black">
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }

                        <div className="px-6 py-5">
                            <Select onValueChange={(value) => setCategoryId(value || null)}>
                                <SelectTrigger className="w-full bg-white text-black">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all" className="text-black">All Categories</SelectItem>
                                    {categories?.map((category) => (
                                        <SelectItem key={category._id} value={category._id} className="text-black">
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <CardContent className="space-y-10">
                            <FileUpload onUpload={handleFileUpload} fileLoader={fileLoader} />
                            <LinkUrl link={link} setLink={setLink} handleSubmit={handleLinkUpload} linkLoader={linkLoader} />
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddSourceModal