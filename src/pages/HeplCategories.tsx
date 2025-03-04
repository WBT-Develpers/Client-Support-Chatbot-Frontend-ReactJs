import { Input } from "@/components/ui/input";
import { getCategoriesByRoles } from "@/services/CategoryServices";
import { ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbCategory2 } from "react-icons/tb";
import PageLoader from "@/components/modal/PageLoader";

interface Category {
    _id: string;
    name: string;
}
const HeplCategories = () => {
    const navigate = useNavigate();

    const { state } = useLocation();
    const { roleId, roleName } = state;

    const [categories, setCategories] = useState<Category[]>([]);
    const [tempCategories, setTempCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [pageLoader, setPageLoader] = useState<boolean>(false);

    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async () => {
        try {
            setPageLoader(true);
            const response: any = await getCategoriesByRoles(roleId || 'all');
            if (response.statusCode !== 200) {
                setPageLoader(false);
                alert("Failed to fetch categories");
            } else {
                setCategories(response.categories);
                setTempCategories(response.categories);
                setPageLoader(false);
            }
        } catch (error: any) {
            alert(error.message);
            setPageLoader(false);
        }
    }


    const navigateToCategory = (category: any) => {
        navigate(`/knowledge-base`, { state: { categoryId: category?._id, categoryName: category?.name } });
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const filteredCategories = tempCategories.filter((category) => category.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setCategories(filteredCategories);
    };

    return (
        <div className="px-10">
            <div className="flex flex-col mt-10">
                <div className="flex items-center justify-between">
                    <div onClick={() => navigate(-1)} className="flex items-center border py-1 pr-4 rounded-md cursor-pointer">
                        <ChevronLeft className="w-8 h-8 text-blue-500" />
                        Go Back
                    </div>
                    <h1 className="font-bold text-blue-500 capitalize text-3xl">{roleName}</h1>
                    <h1></h1>
                </div>
                <div className="mt-10 relative self-center">
                    <Search className="absolute top-2 left-3 text-gray-300" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e)}
                        className="pl-12 w-[500px]"
                    />
                    {
                        searchTerm && (
                            <div
                                onClick={() => { setSearchTerm(''); setCategories(tempCategories); }}
                                className="w-7 h-7 flex justify-center items-center border absolute top-1.5 right-3 rounded-full p-1 cursor-pointer hover:bg-gray-300 hover:scale-95"
                            >
                                <X className=" text-gray-500 " />
                            </div>
                        )
                    }
                </div>
            </div>
            {
                pageLoader && (
                    <PageLoader />
                )
            }
            <div className="grid grid-cols-3 gap-10 mt-10 mx-28">
                {
                    categories?.length > 0 ?
                        categories.map((category) => {
                            return (
                                <div onClick={() => navigateToCategory(category)} className="flex flex-col justify-center items-center bg-white p-5 rounded-md cursor-pointer">
                                    <TbCategory2 className="w-16 h-16 text-blue-500" />
                                    <h2 className="font-semibold mt-5 text-center">{category.name}</h2>
                                </div>
                            )
                        })
                        :
                        <div className="flex h-[70vh] w-[70vw] justify-center items-center">
                            <h2 className="font-semibold mt-5 text-center text-gray-500">No categories available</h2>
                        </div>
                }
            </div>
        </div>
    )
}

export default HeplCategories