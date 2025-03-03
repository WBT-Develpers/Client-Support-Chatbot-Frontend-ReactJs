// src/components/AddQuestionForm.jsx
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Category {
    _id: string;
    name: string;
}

interface Role {
    _id: string;
    name: string;
    login_name: string;
    created_at: Date;
    updated_at: Date;
}

const AddQuestionForm = ({ onSubmit, initialQuestion }: { onSubmit: (question: { question: string; answer: string, faqId: any, category_id: string, role_id: string, admin_id: string }, actionType: string) => void, initialQuestion?: { category: string; question: string; answer: string, faqId: string, category_id: string, role_id: string } }) => {
    const [question, setQuestion] = useState(initialQuestion?.question || "");
    const [answer, setAnswer] = useState(initialQuestion?.answer || "");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialQuestion?.category_id || null);

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const [roles, setRoles] = useState<Role[]>([]);
    const [roleId, setRoleId] = useState<string | null>(userData?.role === 'admin' ? initialQuestion?.role_id : userData?._id || '');

    useEffect(() => {
        if (roleId !== 'all') {
            fetchCategories();
        }
        if (userData?.role === 'admin') {
            fetchRoles();
        }
    }, [roleId])

    const fetchRoles = async () => {
        try {
            let apiUrl = `http://localhost:3000/api/roles`;
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                setRoles(data.roles);
            } else {
                console.error("Failed to fetch roles");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const backendUrl = "http://localhost:3000";
            const response = await fetch(`${backendUrl}/api/categories/role/${roleId !== 'all' ? roleId : ''}`);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            question,
            answer,
            category_id: selectedCategoryId ?? "",
            faqId: initialQuestion?.faqId,
            role_id: userData?.role === 'admin' ? roleId || '' : userData?._id || '',
            admin_id: userData?.role === 'admin' ? 'admin' : userData?._id || ''
        },
            initialQuestion?.question ? 'update' : 'add');
        setQuestion("");
        setAnswer("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {
                userData?.role === 'admin' && (
                    <div className="pb-5">
                        <Select value={roleId || ""} onValueChange={(value) => setRoleId(value || null)}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="all" className="">All Roles</SelectItem>
                                {roles?.map((role) => (
                                    <SelectItem key={role._id} value={role._id} className="">
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )
            }
            {/* <Label htmlFor="question">category</Label> */}
            <Select value={selectedCategoryId || ""} onValueChange={(value) => setSelectedCategoryId(value || null)}>
                <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="all" className="">All Categories</SelectItem>
                    {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id} className="">
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div>
                <Label className="mt-5" htmlFor="question">Question</Label>
                <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter the question"
                    required
                />
            </div>
            <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter the answer"
                    required
                    className="min-h-[200px]"
                />
            </div>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Add Question</Button>
        </form>
    );
};

export default AddQuestionForm;