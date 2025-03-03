import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { debounce } from "lodash";
import AddRoleModal from "@/components/pages/AddRoleModal";
import ConfirmationDialog from "@/components/pages/ConfirmationDialog";
import { deleteAnRole, getRoles } from "@/services/RoleService";
import { Input } from "@/components/ui/input";

interface Role {
    _id: string;
    name: string;
    login_name: string;
    created_at: Date;
    updated_at: Date;
    decrypted_password: string
}

const Roles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editQuestion, setEditQuestion] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSetSearch(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        fetchRoles();
    }, [debouncedSearchTerm])

    const fetchRoles = async () => {
        try {
            const response: any = await getRoles(debouncedSearchTerm);
            if (response.statusCode === 200) {
                setRoles(response.roles);
            } else {
                console.error("Failed to fetch roles");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const deleteRole = async (id: string) => {
        try {
            const response: any = await deleteAnRole(id);
            if (response.statusCode === 200) {
                setOpenDeleteModal(false);
                fetchRoles();
            } else {
                alert("Failed to delete role");
            }
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    const onCloseModal = () => {
        setIsAddModalOpen(false);
        setEditQuestion(null);
        fetchRoles();
    };

    const onCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        fetchRoles();
    };

    return (
        <div className="p-10 min-h-screen text-black">

            {
                openDeleteModal && (
                    <ConfirmationDialog
                        isOpen={openDeleteModal}
                        onClose={onCloseDeleteModal}
                        onConfirm={() => deleteRole(editQuestion._id)}
                        title="Delete Role"
                        description="Are you sure you want to delete this role?"
                    />
                )
            }

            {
                isAddModalOpen &&
                <AddRoleModal
                    isOpen={isAddModalOpen}
                    onClose={onCloseModal}
                    initialValue={editQuestion}
                />
            }

            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search roles..."
                            className="pl-8 h-10 w-64 rounded-md border bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>
                </div>
                <Button onClick={() => { setIsAddModalOpen(true); }} className="bg-blue-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                </Button>
            </div>

            <div className="rounded-md border mt-10">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border-r font-semibold text-center capitalize">S.NO.</TableHead>
                            <TableHead className="border-r font-semibold text-center capitalize">Role name</TableHead>
                            <TableHead className="border-r font-semibold text-center capitalize">Login id</TableHead>
                            <TableHead className="border-r font-semibold text-center capitalize">password</TableHead>
                            <TableHead className="font-semibold text-center capitalize">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles?.map((category: any, index: any) => (
                            <TableRow key={category._id}>
                                <TableCell className="font-medium text-center border-r">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="font-medium text-center border-r capitalize">{category?.name}</TableCell>
                                <TableCell className="font-medium text-center border-r">
                                    {category?.login_name}
                                </TableCell>
                                <TableCell className="font-medium text-center border-r capitalize">{category?.decrypted_password || category?.password}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2 justify-center items-center">
                                        <Button onClick={() => { setEditQuestion(category); setIsAddModalOpen(true) }} variant="ghost" size="sm" className='bg-white'>
                                            <Edit className="h-4 w-4 text-red-500" />
                                        </Button>
                                        <Button onClick={() => { setEditQuestion(category); setOpenDeleteModal(true) }} variant="ghost" size="sm" className='bg-white'>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Roles