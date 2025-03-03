import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const Chatbot = ({ categoryId = '6784e93bae96573d23c0065a' }: any) => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleSendMessage = async () => {
        try {
            const backendUrl = 'http://localhost:4000';
            const result = await fetch(`${backendUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, categoryId }),
            });
            const data = await result.json();
            setResponse(data.response);
        } catch (error) {
            console.error('Error sending message:', error);
            setResponse('Failed to generate response');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </div>
            {response && (
                <div className="p-4 bg-gray-100 rounded">
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default Chatbot;