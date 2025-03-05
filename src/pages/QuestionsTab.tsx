import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddQuestionModal from "@/components/pages/AddQuestionModal";
import ConfirmationDialog from "@/components/pages/ConfirmationDialog";
import ViewAnswerModal from "@/components/pages/ViewAnswerModal";
import moment from 'moment';
import { getCategories } from "@/services/CategoryServices";
import { deleteAnFaq, getQuestions } from "@/services/QuestionServices";

interface Question {
    _id: string;
    category_name: string;
    question: string;
    answer: string;
    status: string;
    category_id: string;
    role_id: string;
    role_name: string;
    uploaded_by: string;
    created_at: Date;
    updated_at: Date;
}

interface Category {
    _id: string;
    name: string;
}

const QuestionsTab = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editQuestion, setEditQuestion] = useState<Question | null>(null);
    const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [viewAnswer, setViewAnswer] = useState<{ isOpen: boolean; answer: string }>({
        isOpen: false,
        answer: "",
    });
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        fetchCategories();
        fetchQuestions();
    }, [selectedCategoryId]);


    const fetchCategories = async () => {
        try {
            const response: any = await getCategories();
            if (response.statusCode === 200) {
                setCategories(response.categories);
            } else {
                console.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const response: any = await getQuestions(selectedCategoryId, userData);
            if (response.statusCode === 200) {
                setQuestions(response.faqs);
            } else {
                console.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleDeleteQuestion = async () => {
        try {
            const response: any = await deleteAnFaq(deleteQuestionId);
            if (response.statusCode === 200) {
                fetchQuestions();
                setIsConfirmationOpen(false);
                setDeleteQuestionId(null);
            } else {
                console.error("Failed to delete question");
                setIsConfirmationOpen(false);
                setDeleteQuestionId(null);
                alert("Failed to delete question");
            }
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    return (
        <div className="p-10 min-h-screen text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Questions</h1>
                <div className="flex items-center space-x-4">
                    <Select onValueChange={(value) => setSelectedCategoryId(value || null)}>
                        <SelectTrigger className="w-[200px] bg-white ">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white ">
                            <SelectItem value="all" className="">All Categories</SelectItem>
                            {categories?.map((category) => (
                                <SelectItem key={category._id} value={category._id} className="text-black">
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                        <Plus className="mr-2 h-4 w-4" /> Add Q&A
                    </Button>
                </div>
            </div>


            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border-r font-semibold text-center whitespace-nowrap capitalize">S.NO.</TableHead>
                            <TableHead className="border-r font-semibold text-center whitespace-nowrap capitalize">Category Name</TableHead>
                            <TableHead className="border-r font-semibold text-center whitespace-nowrap capitalize">Question</TableHead>
                            <TableHead className="border-r font-semibold text-center whitespace-nowrap capitalize">Answer</TableHead>
                            <TableHead className="border-r font-semibold text-center whitespace-nowrap capitalize">Role</TableHead>
                            <TableHead className="border-r font-semibold text-center whitespace-nowrap capitalize">Trained by</TableHead>
                            <TableHead className="border-r font-semibold text-center whitespace-nowrap capitalize">Trained on</TableHead>
                            <TableHead className="border-r font-semibold text-center whitespace-nowrap capitalize">Updated on</TableHead>
                            <TableHead className="font-semibold text-center whitespace-nowrap capitalize">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            questions?.length === 0 ? (
                                <TableRow className="h-40 text-center">
                                    <TableCell colSpan={9} className="h-40 text-center text-gray-400">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )
                                :
                                questions?.map((category: any, index: any) => (
                                    <TableRow key={category._id}>
                                        <TableCell className="font-medium text-center border-r capitalize">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium text-center border-r capitalize whitespace-nowrap">{category?.category_name}</TableCell>
                                        <TableCell className="font-medium text-center border-r">
                                            {category?.question}
                                        </TableCell>
                                        <TableCell className="font-medium text-center border-r cursor-pointer">
                                            {category?.answer?.length > 100 ? (
                                                <>
                                                    {category?.answer.slice(0, 100)}
                                                    {!category?.expanded ? "..." : category?.answer.slice(100)}
                                                    <span
                                                        className="text-blue-500 ml-1"
                                                        onClick={() => setViewAnswer({ isOpen: true, answer: category?.answer })}
                                                    >
                                                        {category?.expanded ? "Read Less" : "Read More"}
                                                    </span>
                                                </>
                                            ) : (
                                                category?.answer
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium text-center border-r cursor-pointer capitalize whitespace-nowrap">{category?.role_name}</TableCell>
                                        <TableCell className="font-medium text-center border-r cursor-pointer capitalize whitespace-nowrap">{category?.uploaded_by}</TableCell>
                                        <TableCell className="font-medium text-center border-r cursor-pointer capitalize whitespace-nowrap">{moment(category?.created_at).format('MMMM D, YYYY h:mm A')}</TableCell>
                                        <TableCell className="font-medium text-center border-r cursor-pointer capitalize whitespace-nowrap">{moment(category?.updated_at).format('MMMM D, YYYY h:mm A')}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2 justify-center items-center capitalize">
                                                <Button onClick={() => { setEditQuestion(category); setIsAddModalOpen(true) }} variant="ghost" size="sm" className='bg-white'>
                                                    <Edit className="h-4 w-4 text-red-500" />
                                                </Button>
                                                <Button onClick={() => { setDeleteQuestionId(category._id); setIsConfirmationOpen(true) }} variant="ghost" size="sm" className='bg-white'>
                                                    <Trash className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </div>

            {
                isAddModalOpen && (
                    <AddQuestionModal
                        isOpen={isAddModalOpen || !!editQuestion}
                        onClose={() => {
                            setIsAddModalOpen(false);
                            setEditQuestion(null);
                            fetchQuestions();
                        }}
                        onSave={() => { }}
                        initialQuestion={editQuestion ?
                            {
                                category: editQuestion.category_name,
                                question: editQuestion.question,
                                answer: editQuestion.answer,
                                faqId: editQuestion._id,
                                category_id: editQuestion.category_id,
                                role_id: editQuestion.role_id
                            } : undefined}
                    />
                )
            }

            {
                isConfirmationOpen && (
                    <ConfirmationDialog
                        isOpen={!!deleteQuestionId}
                        onClose={() => { setIsConfirmationOpen(false); setDeleteQuestionId(null) }}
                        onConfirm={handleDeleteQuestion}
                        title="Delete Question"
                        description="Are you sure you want to delete this question?"
                    />
                )
            }


            {
                viewAnswer.isOpen && (
                    <ViewAnswerModal
                        isOpen={viewAnswer.isOpen}
                        onClose={() => setViewAnswer({ isOpen: false, answer: "" })}
                        answer={viewAnswer.answer}
                    />
                )
            }

        </div>
    );
};

export default QuestionsTab;