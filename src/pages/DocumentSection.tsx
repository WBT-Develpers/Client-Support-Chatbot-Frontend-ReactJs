import { Input } from "@/components/ui/input";
// import { getAnswer } from "@/services/DocumentServices";
import { getTrainedDataByCategoryId } from "@/services/TrainedDataServices";
import { ChevronLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoDocumentTextOutline } from "react-icons/io5";

const DocumentSection = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { module, question, moduleId, content } = state;

    const [searchTerm, setSearchTerm] = useState<string>('');
    // const [loader, setLoader] = useState(false);
    const [answer, setAnswer] = useState<any>(content);
    const [modules, setModules] = useState<any>([]);
    const [openModuleId, setOpenModuleId] = useState<string | null>(module?._id);
    const [selectedModule, setSelectedModule] = useState<any>(module);
    const [selectedQuestion, setSelectedQuestion] = useState<string>(question);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(moduleId);

    useEffect(() => {
        // fetchAnswers();
        getModules();
    }, []);

    // const fetchAnswers = async (qstn?: string, category_id?: string, document_id?: string) => {
    //     try {
    //         setLoader(true);
    //         const response: any = await getAnswer(qstn || selectedQuestion, category_id || selectedModule?.category_id, document_id || selectedModule?._id);
    //         if (response.statusCode === 200 && response.document) {
    //             setAnswer(response.document);
    //         } else {
    //             console.error("Unexpected response format:", response);
    //             setAnswer({ error: "Invalid response format" });
    //         }
    //     } catch (error) {
    //         console.error("Error fetching answer:", error);
    //         setAnswer({ error: "Failed to load answer" });
    //     } finally {
    //         setLoader(false);
    //     }
    // };

    const getModules = async () => {
        try {
            const response: any = await getTrainedDataByCategoryId(selectedModule?.category_id);
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

    const onClickModule = (module: any, question: string, moduleId: string, content: string) => {
        setSelectedModuleId(moduleId);
        setSelectedModule(module);
        setSelectedQuestion(question);
        // fetchAnswers(question, module?.category_id, moduleId);
        setAnswer(content);
    };

    return (
        <div className="h-[100vh] overflow-y-auto pb-8 px-10">
            <div className="flex flex-col mt-10">
                <div className="flex items-center justify-between">
                    <div onClick={() => navigate(-1)} className="flex items-center border py-1 pr-4 rounded-md cursor-pointer">
                        <ChevronLeft className="w-8 h-8 text-blue-500" />
                        Go Back
                    </div>
                    <h1 className="font-bold text-blue-500 capitalize text-3xl">{selectedModule?.module_name}</h1>
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
                <div className="w-[70%] h-fit bg-white p-5 border-r">
                    <div key={module._id}>
                        <div className="pb-3">
                            <h2 className="text-2xl font-semibold">{selectedQuestion} :</h2>
                            <p className="mt-2">{answer}</p>
                            {/* {loader ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                                </div>
                            ) : answer && !answer.error ? (
                                <div className="text-black text-sm">
                                    {answer.introduction && <p className="mt-3">{answer.introduction}</p>}

                                    {answer.sections && answer.sections.length > 0 && (
                                        <div className="mt-5">
                                            {answer.sections.map((section: any, index: number) => (
                                                <div key={index} className="mb-5">
                                                    <h3 className="text-lg font-semibold text-blue-600">{section.heading}</h3>
                                                    <p className="mt-2">{section.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {answer.conclusion && (
                                        <div className="mt-5">
                                            <h3 className="text-lg font-semibold text-blue-600">Conclusion</h3>
                                            <p className="mt-2">{answer.conclusion}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500">No answer available.</p>
                            )} */}
                        </div>
                    </div>
                </div>


                <div className="w-[40%] h-fit bg-white rounded-md">
                    {modules.map((module1: any) => (
                        <div key={module1._id} className="">
                            <div
                                className={`flex justify-between items-center p-4 cursor-pointer ${openModuleId === module1._id ? "bg-gray-200" : "bg-white"
                                    } hover:bg-gray-300 transition duration-200`}
                                onClick={() => toggleAccordion(module1._id)}
                            >
                                <h2 className="text-lg font-semibold">{module1.module_name}</h2>
                                <div className="flex items-center justify-center bg-blue-500 text-white rounded-full w-8 h-8">
                                    <span className="font-bold">{module1.categorized_modules?.length}</span>
                                </div>
                            </div>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: openModuleId === module1._id ? "auto" : 0,
                                    opacity: openModuleId === module1._id ? 1 : 0,
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-white">
                                    {module1.categorized_modules.map((categorizedModule: any) => (
                                        <motion.div
                                            key={categorizedModule._id}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="flex items-center gap-2 my-4 cursor-pointer"
                                            onClick={() => onClickModule(module1, categorizedModule.title, categorizedModule._id, categorizedModule.content)}
                                        >
                                            <IoDocumentTextOutline className={`w-5 h-5 ${selectedModuleId === categorizedModule._id ? 'text-blue-500' : 'text-gray-500'}`} />
                                            <p className={`${selectedModuleId === categorizedModule._id ? 'text-blue-500' : 'text-gray-500'}`}>{categorizedModule.title}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentSection;