import { Input } from "@/components/ui/input";
import { getTrainedDataByCategoryId } from "@/services/TrainedDataServices";
import { ChevronLeft, Search } from "lucide-react"
import { useEffect, useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const ViewAll = () => {
    const navigate = useNavigate();

    const { state } = useLocation();
    const { module } = state;

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [modules, setModules] = useState<any>([]);
    const [openModuleId, setOpenModuleId] = useState<string | null>(null);

    useEffect(() => {
        getModules();
    }, [])

    const getModules = async () => {
        try {
            const response: any = await getTrainedDataByCategoryId(module?.category_id);
            if (response.statusCode === 200) {
                setModules(response.documents);
            } else {
                alert("Failed to fetch modules");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleAccordion = (moduleId: string) => {
        setOpenModuleId(openModuleId === moduleId ? null : moduleId);
    };

    const navigateToDocuments = (module: any, question: string, moduleId: string, content: string) => {
        navigate(`/knowledge-base-docs`, { state: { module, question, moduleId, content } });
    }

    return (
        <div className="h-[100vh] overflow-y-auto bg-[#f8f9fc] pb-8 px-10">
            <div className="flex flex-col mt-10">
                <div className="flex items-center justify-between">
                    <div onClick={() => navigate(-1)} className="flex items-center border py-1 pr-4 rounded-md cursor-pointer">
                        <ChevronLeft className="w-8 h-8 text-blue-500" />
                        Go Back
                    </div>
                    <h1 className="font-bold text-blue-500 capitalize text-3xl">{module?.module_name}</h1>
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

            <div className="mt-10 w-[100%] flex gap-10">
                <div className="w-[60%] h-fit bg-white p-5">
                    <div
                        key={module._id}
                        className={``}
                    >
                        <div className="flex justify-between items-center pb-3">
                            <h2 className="text-lg font-semibold">{module.module_name}</h2>
                        </div>

                        {module.categorized_modules
                            .map((categorizedModule: any) => (
                                <div
                                    key={categorizedModule._id}
                                    onClick={() => navigateToDocuments(module, categorizedModule.title, categorizedModule._id, categorizedModule.content)}
                                    className="flex items-center gap-2 mt-7 cursor-pointer">
                                    <IoDocumentTextOutline className="w-5 h-5 text-gray-500" />
                                    <p className="text-gray-600">{categorizedModule.title}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>


                <div className="w-[40%] h-fit bg-white rounded-md">
                    {modules.map((module: any) => (
                        <div key={module._id} className="border-b">
                            <div
                                className={`flex justify-between items-center p-4 cursor-pointer ${openModuleId === module._id ? "bg-gray-200" : "bg-white"
                                    } hover:bg-gray-300 transition duration-200`}
                                onClick={() => toggleAccordion(module._id)}
                            >
                                <h2 className="text-lg font-semibold">{module.module_name}</h2>
                                <div className="flex items-center justify-center bg-blue-500 text-white rounded-full w-8 h-8">
                                    <span className="font-bold">{module.categorized_modules?.length}</span>
                                </div>
                            </div>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: openModuleId === module._id ? "auto" : 0,
                                    opacity: openModuleId === module._id ? 1 : 0,
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-white">
                                    {module.categorized_modules.map((categorizedModule: any) => (
                                        <motion.div
                                            key={categorizedModule._id}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="flex items-center gap-2 my-4 cursor-pointer"
                                            onClick={() => navigateToDocuments(module, categorizedModule.title, categorizedModule._id, categorizedModule.content)}
                                        >
                                            <IoDocumentTextOutline className="w-5 h-5 text-gray-500" />
                                            <p className="text-gray-600">{categorizedModule.title}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
