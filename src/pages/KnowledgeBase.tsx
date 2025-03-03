import { Input } from "@/components/ui/input";
import { getTrainedDataByCategoryId } from "@/services/TrainedDataServices";
import { ChevronLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const KnowledgeBase = () => {
    const navigate = useNavigate();

    const { state } = useLocation();
    const { categoryId, categoryName } = state;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [modules, setModules] = useState<any>([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        getModules();
        console.log(setShowAll);
    }, []);

    const getModules = async () => {
        try {
            const response: any = await getTrainedDataByCategoryId(categoryId);
            if (response.statusCode === 200) {
                setModules(response.documents);
            } else {
                alert("Failed to fetch modules");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const navigateToDocuments = (module: any, question: string, moduleId: string, content: string) => {
        navigate(`/knowledge-base-docs`, { state: { module, question, moduleId, content } });
    }

    return (
        <div className="h-[100vh] overflow-y-auto pb-8 px-10">
            <div className="flex flex-col mt-10">
                <div className="flex items-center justify-between">
                    <div onClick={() => navigate(-1)} className="flex items-center border py-1 pr-4 rounded-md cursor-pointer">
                        <ChevronLeft className="w-8 h-8 text-blue-500" />
                        Go Back
                    </div>
                    <h1 className="font-bold text-blue-500 capitalize text-3xl">{categoryName}</h1>
                    <h1></h1>
                </div>
                <div className="mt-10 relative self-center">
                    <Search className="absolute top-2 left-3 text-gray-300" />
                    <Input
                        placeholder="Search knowledge base..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 w-[500px]"
                    />
                </div>
            </div>

            <div className="mt-10">
                <div className="flex flex-wrap justify-center">
                    {
                        modules?.length > 0 ?
                            modules.map((module: any) => {
                                return (
                                    <div
                                        key={module._id}
                                        className={`bg-white rounded-md p-4 m-4 w-[450px]`}
                                    >
                                        <div className="flex justify-between items-center border-b pb-3">
                                            <h2 className="text-lg font-semibold">{module.module_name}</h2>
                                            <div className="flex items-center justify-center bg-blue-500 text-white rounded-full w-8 h-8">
                                                <span className="font-bold">{module.categorized_modules?.length}</span>
                                            </div>
                                        </div>

                                        {module.categorized_modules
                                            .slice(0, showAll ? module.categorized_modules.length : 8)
                                            .map((categorizedModule: any) => (
                                                <div onClick={() => navigateToDocuments(module, categorizedModule.title, categorizedModule._id, categorizedModule.content)} key={categorizedModule._id} className="flex items-center gap-2 mt-7 cursor-pointer">
                                                    <IoDocumentTextOutline className="w-5 h-5 text-gray-500" />
                                                    <p className="text-gray-600">{categorizedModule.title}</p>
                                                </div>
                                            ))
                                        }

                                        {/* {module.categorized_modules.length > 8 && !showAll && ( */}
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate("/view-all-knowledge-base", { state: { module } })
                                            }}
                                            className="mt-4 text-blue-500 text-sm border p-2 rounded-md cursor-pointer w-[80px] flex justify-center items-center"
                                        >
                                            View All
                                        </div>
                                        {/* )} */}
                                    </div>
                                );
                            })
                            :
                            <h1 className="text-center text-gray-500 text-2xl">No modules found</h1>
                    }
                </div>
            </div>

        </div>
    )
}

export default KnowledgeBase