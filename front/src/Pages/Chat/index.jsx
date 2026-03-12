import { Route, Routes } from 'react-router-dom';
import { P404 } from '../P404';

import { Chat as ChatPage } from './Chat';

export const Chat = () => {

    return (
        <Routes>
            <Route path="chat" element={ <ChatPage /> } />
            <Route path="*" element={ <P404 /> } />
        </Routes>
    )
}