import LeaderBoard from "../model/LeaderboardModel.js";

// Add user to the leaderboard
export const addToLeaderBoard = async (req, res) => {
  try {
    const { userId, name, image, quizId, score } = req.body;
    const newEntry = new LeaderBoard({ userId, name, image, quizId, score });
    await newEntry.save();
    res.status(201).json({ message: "User added to leaderboard", entry: newEntry });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to leaderboard" });
  }
};

// Get leaderboard (top scores)
export const getLeaderBoard = async (req, res) => {
  try {
    const topScores = await LeaderBoard.find().sort({ score: -1 }).limit(10); // Top 10 users
    res.status(200).json(topScores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

// Get leaderboard for a specific quiz
export const getQuizLeaderBoard = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quizScores = await LeaderBoard.find({ quizId }).sort({ score: -1 }).limit(10);
    res.status(200).json(quizScores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz leaderboard" });
  }
};
