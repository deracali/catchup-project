// routes/chatRoutes.js
import express from 'express';
import { getMessages, createMessage } from '../controller/messagesController.js';

const messageRoute = express.Router();

// GET all messages
messageRoute.get('/messages', getMessages);

// POST a new message or reply
messageRoute.post('/messages', createMessage);

export default messageRoute;
