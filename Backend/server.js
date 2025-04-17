import express from 'express';
import mongoose from 'mongoose';
import  UserRouter  from './route/UserRoute.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import CoursesRouter from './route/CoursesRoute.js';
const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb+srv://chideracalistus:economic00@cluster0.aryyobw.mongodb.net/afourcoding';

const GEMINI_API_KEY = 'AIzaSyAlw9zz86cXdbg7fvm5kd5BTrpFoNhTBic';

import cors from "cors";
import courseRoutes from './route/liveCourseRoute.js';
import messageRoute from './route/messagesRoute.js';
import reviewRoute from './route/reviewRoute.js';
import QuizRoute from './route/QuizRoute.js';
import OfflineCourseRoute from './route/OfflineCourseRoute.js';
import TeacherReviewRoute from './route/TeacherReviewRoute.js';
import AdminRoute from './route/AdminRoute.js';
import TeacherRoute from './route/TeachersRoute.js';
import QuizDataRoute from './route/QuizDataRoute.js';
import LeaderBoardRoute from './route/LeaderBoard.js';
import BookRoute from './route/BookRoute.js';

// Allow requests from all origins (for development)
app.use(cors());


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


// Middleware
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.post('/ask-gemini', async (req, res) => {
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }
  
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
      const payload = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      };
  
      const apiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!apiRes.ok) {
        const errData = await apiRes.json().catch(() => null);
        console.error('Gemini API error:', errData || apiRes.statusText);
        return res
          .status(500)
          .json({ error: 'Gemini API failed', details: errData });
      }
  
      const data = await apiRes.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
  
      return res.json({ text });
    } catch (err) {
      console.error('Fetch error:', err);
      return res
        .status(500)
        .json({ error: 'Internal server error', details: err.message });
    }
  });
  

// Routes
app.use("/api/users", UserRouter);
app.use("/api/admin", AdminRoute);
// app.use("/api/course", CoursesRouter);
app.use("/api/offlinecourse", OfflineCourseRoute);
app.use("/api/livecourses", courseRoutes);
app.use('/api', messageRoute);
app.use('/api/teacher-reviews', TeacherReviewRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/teachers", TeacherRoute);
app.use("/api/quiz", QuizRoute);
app.use("/api/quiz-scores", QuizDataRoute);
app.use("/api/leaderboard", LeaderBoardRoute);
app.use("/api", BookRoute);


app.get('/', (req, res) => {
    res.send('Server is running on port 3000');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
