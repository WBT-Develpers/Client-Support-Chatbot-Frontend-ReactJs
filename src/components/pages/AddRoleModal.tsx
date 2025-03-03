import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '../ui/dialog';
import { Input } from '../ui/input';
import { createRole } from '@/services/RoleService';


interface AddRolesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialValue?: { name: string; login_name: string; password: string; _id: string };
}

const AddRoleModal: React.FC<AddRolesModalProps> = ({ isOpen, onClose, initialValue }) => {

    const [name, setName] = useState(initialValue?.name || '');
    const [loginName, setLoginName] = useState(initialValue?.login_name || '');
    const [password, setPassword] = useState(initialValue?.password || '');


    const handleAddRole = async (data: any, actionType: string) => {
        try {
            const response: any = await createRole(actionType, data, initialValue);
            if (response.statusCode === 201 || response.statusCode === 200) {
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='' onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader className='px-4 py-2'>
                    <DialogTitle>{initialValue?.name ? 'Update Role' : 'Add Role'}</DialogTitle>
                </DialogHeader>
                <div className="overflow-auto px-4">
                    <div className="mx-auto flex flex-col">
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); }}
                            placeholder="Enter Role Name"
                            className='h-12 mt-5'
                        />

                        <Input
                            type="text"
                            id="login_name"
                            value={loginName}
                            onChange={(e) => { setLoginName(e.target.value); }}
                            placeholder="Enter Login Name"
                            className='h-12 my-4'
                        />

                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); }}
                            placeholder="Enter Password"
                            className='h-12 mb-5'
                        />
                    </div>
                </div>
                <DialogFooter className='px-4'>
                    <button className="bg-purple-200 border border-purple-200 text-purple-800 hover:bg-purple-100 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={() => handleAddRole({ name, login_name: loginName, password, decrypted_password: password }, initialValue?.name ? "update" : "add")}
                    >
                        {initialValue?.name ? 'Update Role' : 'Add Role'}
                    </button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddRoleModal