import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import CustomSwitch from '@/components/pages/CustomSwitch';
import AddSourceModal from '@/components/pages/AddSourceModal';
import moment from 'moment';
import { getTrainedData, toggleAnStatus } from '@/services/TrainedDataServices';
import { getCategories } from '@/services/CategoryServices';
import { Input } from '@/components/ui/input';

interface Category {
    _id: string;
    name: string;
}

const TrainedData = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    const [trainedData, setTrainedData] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [isModalVisible, setIsAddModalVisible] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [nextPage, setNextPage] = useState<number | null>(null);
    const [prevPage, setPrevPage] = useState<number | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>('');
    const [statusFilter, setStatusFilter] = useState<any>();
    const [categories, setCategories] = useState<Category[]>([]);
    const statusData = [{ label: 'Active', value: 'true' }, { label: 'Inactive', value: 'false' }];

    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 500),
        []
    );

    useEffect(() => {
        fetchTrainedData(1);
    }, [debouncedSearchTerm, categoryFilter, statusFilter]);

    useEffect(() => {
        fetchTrainedData(currentPage);
    }, [currentPage]);

    useEffect(() => {
        debouncedSetSearch(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response: any = await getCategories();
            if (response.statusCode !== 200) {
                alert("Failed to fetch categories");
            } else {
                setCategories(response.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchTrainedData = async (page: number) => {
        try {
            const response: any = await getTrainedData(categoryFilter, statusFilter, page, debouncedSearchTerm, userData);
            if (response?.statusCode === 200) {
                setTrainedData(response?.documents);
                setTotalPages(response?.totalPages);
                setCurrentPage(response?.currentPage);
                setNextPage(response?.nextPage);
                setPrevPage(response?.prevPage);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const response: any = await toggleAnStatus(id);
            if (response.statusCode !== 200) {
                alert("Failed to update status");
            } else {
                setTrainedData((prevData: any) =>
                    prevData.map((item: any) =>
                        item._id === id ? { ...item, is_active: !currentStatus } : item
                    )
                );
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePageChange = (newPage: number | null) => {
        if (newPage) {
            setCurrentPage(newPage);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setCategoryFilter('');
        setStatusFilter('');
        setSearchTerm('');
        setCurrentPage(1);
    };

    return (
        <div className=" px-10 pt-8 pb-6  space-y-6 ">
            <div className="w-full flex justify-between items-center">
                <div className="w-full flex items-center justify-between space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search categories..."
                            className="pl-8 h-10 w-64 rounded-md border bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="flex space-x-2">
                        <div onClick={clearFilters} className='text-sm flex items-center space-x-2 border px-2 py-1 rounded-md cursor-pointer'>
                            <span>Clear Filter</span>
                            <X size={20} />
                        </div>

                        <div className="">
                            <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="">
                                    <SelectItem value="all_status" className="">Select Status</SelectItem>
                                    {statusData?.map((category: any) => (
                                        <SelectItem key={category.value} value={category.value} className="">
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="">
                            <Select value={categoryFilter || ''} onValueChange={(value) => setCategoryFilter(value || null)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="">
                                    <SelectItem value="all" className="">All Categories</SelectItem>
                                    {categories?.map((category) => (
                                        <SelectItem key={category._id} value={category._id} className="">
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => setIsAddModalVisible(true)} className='text-white bg-blue-600 hover:bg-blue-500'>
                            Add Sources
                            <Plus className="text-white" size={40} color='white' />
                        </Button>
                    </div>
                </div>
            </div>

            <div className='h-[80vh]'>
                <div className="rounded-md border overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border-r font-semibold text-black text-center">S.NO.</TableHead>
                                <TableHead className="border-r font-semibold text-black text-center whitespace-nowrap">Category Name</TableHead>
                                <TableHead className="border-r font-semibold text-black text-center w-48">File Name</TableHead>
                                <TableHead className="border-r font-semibold text-black text-center whitespace-nowrap">Document Type</TableHead>
                                <TableHead className="border-r font-semibold text-black text-center whitespace-nowrap">Role</TableHead>
                                <TableHead className="border-r font-semibold text-black text-center whitespace-nowrap">Trained by</TableHead>
                                <TableHead className="border-r font-semibold text-black text-center whitespace-nowrap">Trained on</TableHead>
                                {/* <TableHead className="border-r font-semibold text-black text-center whitespace-nowrap">Updated on</TableHead> */}
                                <TableHead className="border-r font-semibold text-black text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                trainedData?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center">
                                            No data found.
                                        </TableCell>
                                    </TableRow>
                                )
                                    :
                                    trainedData?.map((doc: any, index: number) => (
                                        <TableRow key={doc._id}>
                                            <TableCell className="font-medium text-center border-r text-sm">
                                                {(currentPage - 1) * 10 + index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium text-center border-r text-sm whitespace-nowrap">{doc?.category_name}</TableCell>
                                            <TableCell className="font-medium text-center border-r text-sm ">
                                                <a
                                                    className="text-black hover:text-indigo-300"
                                                    href={doc?.file_url ? `http://localhost:3000${doc?.file_url}` : `${doc?.link_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {doc?.file_name || doc?.link_url}
                                                </a>
                                            </TableCell>
                                            <TableCell className="font-medium text-center border-r text-sm">{doc?.type}</TableCell>
                                            <TableCell className="font-medium text-center border-r text-sm whitespace-nowrap">{doc?.role_name}</TableCell>
                                            <TableCell className="font-medium text-center border-r text-sm whitespace-nowrap">{doc?.uploaded_by}</TableCell>
                                            <TableCell className="font-medium text-center border-r text-sm whitespace-nowrap">{moment(doc?.metadata?.uploadDate).format('MMMM D, YYYY h:mm A')}</TableCell>
                                            {/* <TableCell className="font-medium text-center border-r text-sm whitespace-nowrap">{moment(doc?.updated_at).format('MMMM D, YYYY h:mm A')}</TableCell> */}
                                            <TableCell className="font-medium text-center border-r cursor-pointer">
                                                <CustomSwitch checked={doc?.is_active} onChange={() => toggleStatus(doc._id, doc.is_active)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {
                totalPages > 1 && (
                    <div className="flex justify-end items-center space-x-4 pb-10">
                        <Button onClick={() => handlePageChange(prevPage)} disabled={!prevPage}><ChevronLeft /></Button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <Button onClick={() => handlePageChange(nextPage)} disabled={!nextPage}><ChevronRight /></Button>
                    </div>
                )
            }

            {isModalVisible && (
                <AddSourceModal
                    isOpen={isModalVisible}
                    onClose={() => {
                        setIsAddModalVisible(false);
                        fetchTrainedData(currentPage);
                    }}
                />
            )}
        </div>
    );
};

export default TrainedData;
