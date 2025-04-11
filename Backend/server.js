import express from 'express';
import mongoose from 'mongoose';
import  UserRouter  from './route/UserRoute.js';
// import CoursesRouter from './route/CoursesRoute.js';
const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb+srv://chideracalistus:economic00@cluster0.aryyobw.mongodb.net/afourcoding';


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
