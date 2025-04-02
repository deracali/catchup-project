// controllers/chatController.js
import Message from '../model/messagesModel.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const createMessage = async (req, res) => {
  const { text, replyTo } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ success: false, message: 'Text is required and must be a string' });
  }

  try {
    const newMessage = await Message.create({ text, replyTo });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
