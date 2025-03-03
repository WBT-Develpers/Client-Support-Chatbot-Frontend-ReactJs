import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Trash2, Edit, Plus, ArrowUpDown, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import AddCategoryModal from '@/components/pages/AddCategoryModal';
import ConfirmationDialog from '@/components/pages/ConfirmationDialog';
import { deleteAnCategory, getCategories } from '@/services/CategoryServices';
import { debounce } from 'lodash';
import { getRoles } from '@/services/RoleService';
import moment from 'moment';
import { Input } from '@/components/ui/input';

interface Category {
    _id: string;
    name: string;
    role_name: string;
    description: string;
    created_at: Date;
}

type SortDirection = 'asc' | 'desc';


const CategoriesTab: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [roles, setRoles] = useState<any>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [limit] = useState<number>(10);

    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 500),
        []
    );

    useEffect(() => {
        fetchCategories();
    }, [debouncedSearchTerm, currentPage, selectedRoleId]);


    useEffect(() => {
        debouncedSetSearch(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        fetchRoles();
    }, []);


    const fetchCategories = async () => {
        try {
            const response: any = await getCategories(currentPage, limit, debouncedSearchTerm, selectedRoleId);
            if (response.statusCode === 200) {
                setCategories(response.categories);
                setTotalPages(response.totalPages);
            } else {
                alert("Failed to fetch categories");
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response: any = await getRoles();
            if (response.statusCode === 200) {
                setRoles(response.roles);
            } else {
                alert("Failed to fetch roles");
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleSaveCategory = async (): Promise<void> => {
        fetchCategories();
    };

    const handleDeleteCategory = async (): Promise<void> => {
        if (deleteCategory) {
            try {
                const response: any = await deleteAnCategory(deleteCategory._id);
                if (response.statusCode === 200) {
                    fetchCategories();
                    setDeleteCategory(null);
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleSort = (): void => {
        setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
    };

    const filteredAndSortedCategories = categories?.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
        .sort((a, b) => {
            const compareResult = a.name.localeCompare(b.name);
            return sortDirection === 'asc' ? compareResult : -compareResult;
        });

    const handleEditCategory = (category: Category): void => {
        setEditCategory(category);
        setIsAddModalOpen(true);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const clearFilters = () => {
        setSelectedRoleId(null);
        setSearchTerm('');
        setCurrentPage(1);
    };

    return (
        <div className="p-10  space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search categories..."
                            className="pl-8 h-10 w-64 rounded-md border bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className='flex items-center gap-5'>
                    <div onClick={clearFilters} className='text-sm flex items-center space-x-2 border px-2 py-[9px] rounded-md cursor-pointer'>
                        <span>Clear Filter</span>
                        <X size={20} />
                    </div>
                    <div className="">
                        <Select value={selectedRoleId || ''} onValueChange={(value) => setSelectedRoleId(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="">
                                <SelectItem value="all_status" className="text-white">Select Role</SelectItem>
                                {roles?.map((role: any) => (
                                    <SelectItem key={role._id} value={role._id} className="">
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => { setIsAddModalOpen(true); setEditCategory(null); }} className='bg-blue-600 text-white hover:bg-blue-500'>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>
            </div>
            <div className='h-[80vh] overflow-auto'>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border-r font-semibold text-center whitespace-nowrap">S.NO.</TableHead>
                                <TableHead
                                    className="cursor-pointer border-r font-semibold text-center whitespace-nowrap"
                                    onClick={handleSort}
                                >
                                    <div className="flex items-center justify-center space-x-1">
                                        <span>Category Name</span>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="border-r font-semibold text-center whitespace-nowrap">Description</TableHead>
                                <TableHead className="border-r font-semibold text-center whitespace-nowrap">Role</TableHead>
                                <TableHead className="border-r font-semibold text-center whitespace-nowrap">Created At</TableHead>
                                <TableHead className="font-semibold text-center whitespace-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-slate-500 py-8"
                                    >
                                        {searchTerm ? 'No categories found' : 'No categories added yet'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAndSortedCategories.map((category, index) => (
                                    <TableRow key={category._id}>
                                        <TableCell className="font-medium text-center border-r">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium text-center border-r capitalize">{category.name}</TableCell>
                                        <TableCell className="font-medium text-center border-r capitalize">{category.description}</TableCell>
                                        <TableCell className="font-medium text-center border-r capitalize whitespace-nowrap">{category.role_name}</TableCell>
                                        <TableCell className="font-medium text-center border-r capitalize whitespace-nowrap">
                                            {moment(category?.created_at).format('MMMM D, YYYY h:mm A')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2 justify-center items-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditCategory(category)}
                                                    className='bg-white'
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteCategory(category)}
                                                    className='bg-white'
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {
                totalPages > 1 && (
                    <div className="flex justify-end items-center space-x-4 mt-4">
                        <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className='bg-blue-500 hover:bg-blue-500'>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <Button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className='bg-blue-500 hover:bg-blue-500'>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )
            }

            {
                isAddModalOpen && (
                    <AddCategoryModal
                        isOpen={isAddModalOpen || !!editCategory}
                        onClose={() => {
                            setIsAddModalOpen(false);
                            setEditCategory(null);
                        }}
                        onSave={handleSaveCategory}
                        initialCategory={editCategory}
                    />
                )
            }

            <ConfirmationDialog
                isOpen={!!deleteCategory}
                onClose={() => setDeleteCategory(null)}
                onConfirm={handleDeleteCategory}
                title="Delete Category"
                description={`Are you sure you want to delete "${deleteCategory?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default CategoriesTab;