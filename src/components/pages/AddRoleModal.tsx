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
    const [errorMessage, setErrorMessage] = useState({ name: '', login_name: '', password: '' });


    const handleAddRole = async (data: any, actionType: string) => {
        try {
            const error = handleError();
            if (error) return;
            const response: any = await createRole(actionType, data, initialValue);
            if (response.statusCode === 201 || response.statusCode === 200) {
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleError = () => {
        setErrorMessage({
            name: name ? '' : 'Name is required',
            login_name: loginName ? '' : 'Login Name is required',
            password: password ? '' : 'Password is required',
        });
        if (!name || !loginName || !password)
            return true;
        else
            return false;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='' onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader className='px-4 py-2'>
                    <DialogTitle className='text-xl'>{initialValue?.name ? 'Update Role' : 'Add Role'}</DialogTitle>
                </DialogHeader>
                <div className="overflow-auto px-4">
                    <div className="flex flex-col">
                        <div className=''>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => { setName(e.target.value); }}
                                placeholder="Enter Role Name"
                                className={`h-12 mt-1 ${errorMessage.name ? 'border-red-500' : ''}`}
                            />
                            {errorMessage.name && <span className="text-red-500 text-sm ml-1">{errorMessage.name}</span>}
                        </div>
                        <div className='my-4'>
                            <Input
                                type="text"
                                id="login_name"
                                value={loginName}
                                onChange={(e) => { setLoginName(e.target.value); }}
                                placeholder="Enter User Name"
                                className={`h-12 ${errorMessage.login_name ? 'border-red-500' : ''}`}
                            />
                            {errorMessage.login_name && <span className="text-red-500 text-sm ml-1">{errorMessage.login_name}</span>}
                        </div>
                        <div className='mb-4'>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); }}
                                placeholder="Enter Password"
                                className={`h-12 ${errorMessage.password ? 'border-red-500' : ''}`}
                            />
                            {errorMessage.password && <span className="text-red-500 text-sm ml-1">{errorMessage.password}</span>}
                        </div>
                    </div>
                </div>
                <DialogFooter className='px-4'>
                    <button className="bg-blue-600 border text-white hover:bg-blue-500 focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus-visible:ring-0 focus:border-0"
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