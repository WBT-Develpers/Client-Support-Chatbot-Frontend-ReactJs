import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import FileUpload from "./FileUpload";
import LinkUrl from "./LinkUrl";

interface Category {
    _id: string;
    name: string;
}

const Documents = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('all');
    const [categoryId, setCategoryId] = useState<string | null>('all');
    const [activePdfs, setActivePdf] = useState<any>([]);
    const [link, setLink] = useState<string>('');
    const [fileLoader, setFileLoader] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchActivePdfs();
    }, [selectedCategoryId]);

    const fetchActivePdfs = async () => {
        try {
            const backendUrl = "http://localhost:3000";
            const response = await fetch(`${backendUrl}/api/train/documents/${selectedCategoryId === 'all' ? '' : selectedCategoryId}`);
            if (response.ok) {
                const data = await response.json();
                const filteredData = data.documents.filter((pdf: any) => pdf.file_url);
                setActivePdf(filteredData);
            } else {
                console.error("Failed to fetch active PDFs");
            }
        } catch (error) {
            console.error("Error fetching active PDFs:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const backendUrl = "http://localhost:3000";
            const response = await fetch(`${backendUrl}/api/categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            } else {
                console.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setFileLoader(true);
            if (categoryId !== 'all') {
                const formData = new FormData();
                formData.append("pdf", file);
                formData.append("category_id", categoryId || '');
                formData.append('admin_id', categoryId || '');

                const response = await fetch("http://localhost:3000/api/train/upload", {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();
                fetchActivePdfs();
                setFileLoader(false);
                console.log("File uploaded:", result);
            } else {
                console.error("Category ID not provided");
                setFileLoader(false);
                alert("Category ID not provided");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setFileLoader(false);
        }
    };

    const handleLinkUpload = async () => {
        try {
            if (categoryId !== 'all') {
                const dataToSend = {
                    link_url: link,
                    category_id: categoryId,
                    admin_id: categoryId,
                }
                console.log(dataToSend);

                const response = await fetch("http://localhost:3000/api/train/train-link", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend),
                });
                const result = await response.json();
                console.log(result);

                fetchActivePdfs();
                console.log("Link uploaded:", result);
            } else {
                console.error("Category ID not provided");
                alert("Category ID not provided");
            }
        } catch (error) {
            console.error("Error uploading link:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <div className="flex items-end justify-end p-8">
                <Select onValueChange={(value) => setSelectedCategoryId(value || null)}>
                    <SelectTrigger className="w-[200px] bg-gray-800 text-gray-300 border-gray-700">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all" className="text-gray-200">All Categories</SelectItem>
                        {categories?.map((category) => (
                            <SelectItem key={category._id} value={category._id} className="text-gray-200">
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-6 overflow-auto h-[85vh] pr-4">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Upload Source Documents</CardTitle>
                    </CardHeader>

                    <div className="px-6 pb-5">
                        <Select onValueChange={(value) => setCategoryId(value || null)}>
                            <SelectTrigger className="w-full bg-gray-800 text-gray-300 border-gray-700">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="all" className="text-gray-200">All Categories</SelectItem>
                                {categories?.map((category) => (
                                    <SelectItem key={category._id} value={category._id} className="text-gray-200">
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <CardContent className="space-y-10">
                        <FileUpload onUpload={handleFileUpload} fileLoader={fileLoader} />
                        <LinkUrl link={link} setLink={setLink} handleSubmit={handleLinkUpload} />
                    </CardContent>
                </Card>

                {activePdfs?.map((pdf: any) => (
                    <Card key={pdf._id} className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="cursor-pointer text-white hover:text-indigo-300">
                                <a className="text-white hover:text-indigo-300" href={`http://localhost:3000${pdf.file_url}`} target="_blank" rel="noopener noreferrer">
                                    {pdf.file_name}
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300">{pdf.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Documents