import { Button } from '../ui/button';

const TrainModel = () => {
    const handleTrainModel = async () => {
        try {
            const backendUrl = 'http://localhost:4000';
            const response = await fetch(`${backendUrl}/api/train`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryId: '6784e93bae96573d23c0065a' }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Fine-tuning job started successfully!');
                console.log('Fine-tuning response:', data);
            } else {
                alert('Failed to start fine-tuning job');
            }
        } catch (error) {
            console.error('Error starting fine-tuning job:', error);
            alert('Failed to start fine-tuning job');
        }
    };

    return (
        <Button onClick={handleTrainModel}>
            Train ChatGPT Model
        </Button>
    );
};

export default TrainModel;