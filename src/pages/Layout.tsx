import Sidebar from '@/components/pages/Sidebar';
import { Outlet } from 'react-router-dom';
import { BsChatFill } from "react-icons/bs";
import { useState } from 'react';
import Chatbot from './Chatbot';

const Layout = () => {
    const [showChatbot, setShowChatbot] = useState(false);

    return (
        <div className={`bg-[#f8f9fc]`}>
            <Sidebar />
            <main
                className={`
                    absolute top-10 right-0 md:top-0 lg:top-0 left-0 
                    md:left-52 lg:left-64 
                    md:w-[calc(100%-16rem)] lg:w-[calc(100%-18rem)]
                    min-h-screen 
                    md:pt-0
                    pt-5
            
                `}
            >
                <Outlet />
                {
                    showChatbot && (
                        <div className='absolute bottom-[14%] left-[1%]'>
                            <Chatbot category={{ _id: '' }} setIsVisible={setShowChatbot} />
                        </div>
                    )
                }
                <div onClick={() => setShowChatbot(!showChatbot)} className='bg-blue-800 cursor-pointer absolute bottom-[5%] left-5 w-14 h-14 flex justify-center items-center rounded-full'>
                    <BsChatFill className='text-2xl text-white' />
                </div>
            </main>
        </div>
    )
}

export default Layout