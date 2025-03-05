import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getRoles } from '@/services/RoleService';
import { createCategory } from '@/services/CategoryServices';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialCategory?: any;
}

interface Role {
    _id: string;
    name: string;
    login_name: string;
    created_at: Date;
    updated_at: Date;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialCategory,
}) => {
    const [category, setCategory] = useState(initialCategory?.name || '');
    const [description, setDescription] = useState(initialCategory?.description || '');
    const [roles, setRoles] = useState<Role[]>([]);
    const [roleId, setRoleId] = useState<string | null>(initialCategory ? initialCategory.role_id : 'all');
    const [errorMessage, setErrorMessage] = useState({ roleId: '', category: '' });

    useEffect(() => {
        fetchRoles();
    }, [])

    const fetchRoles = async () => {
        try {
            const response: any = await getRoles();
            if (response.statusCode === 200) {
                setRoles(response.roles);
            } else {
                console.error("Failed to fetch roles");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleSave = async () => {
        if (checkErrors()) {
            return;
        }

        try {
            const dataToSend: any = {
                name: category,
                description: description,
                role_id: roleId
            }
            const response: any = await createCategory(initialCategory?._id ? 'update' : 'add', dataToSend, initialCategory?._id);
            if (response.statusCode === 201 || response.statusCode === 200) {
                onSave();
                onClose();
            } else {
                alert('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category');
        }
    };

    const checkErrors = () => {
        const errors: any = {};
        if (roleId === 'all') {
            errors.roleId = 'Please select a role';
        }
        if (!category) {
            errors.category = 'Please enter a category name';
        }
        setErrorMessage(errors);
        if (!roleId || !category) {
            return true;
        } else {
            return false;
        }
    };


    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
            modal={true}
        >
            <DialogContent
                className="sm:max-w-[425px]"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {initialCategory ? 'Edit Category' : 'Add Category'}
                    </DialogTitle>
                </DialogHeader>

                <div className="">
                    <Select value={roleId || ""} onValueChange={(value) => setRoleId(value || null)}>
                        <SelectTrigger className={`${errorMessage.roleId ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select Role" className='' />
                        </SelectTrigger>
                        <SelectContent className="">
                            <SelectItem value="all" className="">Select Role</SelectItem>
                            {roles?.map((role) => (
                                <SelectItem key={role._id} value={role._id} className="">
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errorMessage.roleId && <span className="text-red-500 text-sm ml-1">{errorMessage.roleId}</span>}
                </div>

                <div className="">
                    <Input
                        type="text"
                        placeholder="Category Name"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`${errorMessage.category ? 'border-red-500' : ''}`}
                    />
                    {errorMessage.category && <span className="text-red-500 text-sm ml-1">{errorMessage.category}</span>}
                </div>
                <div className="">
                    <Textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-[180px]"
                    />
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className='bg-blue-600 hover:bg-blue-500'>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryModal;