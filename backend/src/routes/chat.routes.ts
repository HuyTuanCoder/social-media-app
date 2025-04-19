import express from 'express';
import { createChatMessage, getChatMessages, deleteChatMessage } from '../controllers/chat.controller';

const ChatRoutes = express.Router();

ChatRoutes.post('/create', createChatMessage);
ChatRoutes.get('/messages', getChatMessages);
ChatRoutes.delete('/delete/:id', deleteChatMessage);

export default ChatRoutes;