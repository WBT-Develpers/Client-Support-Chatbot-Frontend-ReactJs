import PageLoader from "@/components/modal/PageLoader";
import { Input } from "@/components/ui/input";
import { getRoles } from "@/services/RoleService";
import { Search, SquareChartGantt, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Roles {
    _id: string;
    name: string;
}

const HeplCenter = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Roles[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [tempRoles, setTempRoles] = useState<Roles[]>([]);
    const [pageLoader, setPageLoader] = useState<boolean>(false);

    useEffect(() => {
        fetchRoles();
    }, [])
    const fetchRoles = async () => {
        try {
            setPageLoader(true);
            const response: any = await getRoles();
            if (response.statusCode !== 200) {
                alert("Failed to fetch roles");
                setPageLoader(false);
            } else {
                setRoles(response.roles);
                setTempRoles(response.roles);
                setPageLoader(false);
            }
        } catch (error: any) {
            setPageLoader(false);
            alert(error.message);
        }
    }


    const navigateToCategory = (role: any) => {
        navigate(`/categories-knowledge-base`, { state: { roleId: role?._id, roleName: role?.name } });
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const filteredRoles = tempRoles.filter((role) => role.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setRoles(filteredRoles);
    };

    return (
        <div className="px-10">
            <div className="flex flex-col justify-center items-center mt-10">
                <h1 className="font-bold text-blue-500 capitalize text-3xl">Help Center</h1>
                <div className="mt-5 relative">
                    <Search className="absolute top-2 left-3 text-gray-300" />
                    <Input
                        placeholder="Search roles..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e)}
                        className="pl-12 w-[500px]"
                    />

                    {
                        searchTerm && (
                            <div
                                onClick={() => { setSearchTerm(''); setRoles(tempRoles); }}
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
            <div className="grid grid-cols-3 gap-10 mt-16 mx-28">
                {
                    roles?.length > 0 ?
                        roles.map((role) => {
                            return (
                                <div onClick={() => navigateToCategory(role)} className="flex flex-col justify-center items-center bg-white p-5 rounded-md cursor-pointer">
                                    <SquareChartGantt className="w-20 h-20 text-blue-500" />
                                    <h2 className="font-semibold mt-5 text-center">{role.name}</h2>
                                </div>
                            )
                        })
                        :
                        <div className="flex h-[70vh] w-[70vw] justify-center items-center">
                            <h2 className="font-semibold mt-5 text-center text-gray-500">No roles available</h2>
                        </div>
                }
            </div>
        </div>
    )
}

export default HeplCenter