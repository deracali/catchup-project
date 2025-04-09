// models/Message.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Message', messageSchema);
