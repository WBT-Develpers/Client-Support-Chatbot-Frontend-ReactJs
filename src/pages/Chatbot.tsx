import React, { useState } from "react";
import ReactMarkdown from 'react-markdown'
interface Message {
    id: number;
    text?: string;
    audio?: string;
    isUser: boolean;
    timestamp: string;
}

interface ChatbotProps {
    category?: { _id: string };
}

const Chatbot: React.FC<ChatbotProps> = ({ category }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you today?", isUser: false, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, }) },
    ]);
    const [inputText, setInputText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const sendMessage = async (audioFile: string | null = null) => {
        if (!inputText.trim() && !audioFile) return;

        const newMessage: Message = {
            id: messages.length + 1,
            text: audioFile ? undefined : inputText,
            audio: audioFile || undefined,
            isUser: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, })
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText("");
        setLoading(true);

        try {
            const formData = new FormData();

            if (audioFile) {
                formData.append("file", new Blob([audioFile], { type: "audio/mp3" }), "voice_message.mp3");
                formData.append("voice_response", "true");
            } else {
                formData.append("query_text", inputText);
                formData.append("voice_response", inputText.includes("voice") ? "true" : "false");
            }

            formData.append("category_id", category?._id || "");
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            const baseUrl = import.meta.env.VITE_BASE_URL;
            const response = await fetch(`${apiBaseUrl}/query/ask`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const data = await response.json();

            const botMessage: Message = {
                id: messages.length + 2,
                text: data.response,
                audio: data.audio_url ? `${baseUrl}/${data.audio_url}` : undefined,
                isUser: false,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, })
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);

            const errorMessage: Message = {
                id: messages.length + 2,
                text: "Something went wrong!",
                isUser: false,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, })
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };


    const handleSendClick = () => {
        sendMessage();
    };

    return (
        <div className="w-[400px] h-[700px] max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-blue-600 text-white p-3 text-center font-bold">Chatbot</div>

            <div className="p-4 h-[580px] overflow-y-auto space-y-5 bg-gray-100">
                {messages.map((msg) => (
                    <div key={msg.id} className={msg.isUser ? "text-right" : "text-left"}>
                        {(msg.text && !msg.audio) && (
                            <div className={`inline-block px-3 py-2 text-sm rounded-lg ${msg.isUser ? "bg-green-100 text-green-800 max-w-[50%] text-left" : "bg-blue-100 text-blue-800 max-w-[80%]"}`}>
                                <ReactMarkdown>{msg.text || ''}</ReactMarkdown>
                            </div>
                        )}
                        {(msg.audio) && (
                            <div className="mt-1">
                                <audio controls src={msg.audio} className="w-[80%]" color="blue" />
                            </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
                    </div>
                ))}
                {loading && (
                    <div className="text-left">
                        <div className="inline-block bg-blue-100 text-blue-800 rounded-lg px-3 py-2 text-sm">Typing...</div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t flex">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
                <button onClick={handleSendClick} className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
