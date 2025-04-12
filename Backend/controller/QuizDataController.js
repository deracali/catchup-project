import QuizScore from "../model/QuizDataModel.js";

// Add a new quiz score
export const addQuizScore = async (req, res) => {
  try {
    const { userId, quizId, totalScore } = req.body;

    const newScore = new QuizScore({ userId, quizId, totalScore });

    await newScore.save();

    res.status(201).json({ message: "Score added successfully", score: newScore });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: "Failed to add score" });
  }
};

// Get all scores of a user
export const getUserScores = async (req, res) => {
  try {
    const { userId } = req.params;
    const scores = await QuizScore.find({ userId }).populate("quizId", "title");
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scores" });
  }
};

// Get a specific quiz score
export const getQuizScore = async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const score = await QuizScore.findOne({ userId, quizId }).populate("quizId", "title");
    if (!score) return res.status(404).json({ error: "Score not found" });
    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch score" });
  }
};

// Calculate total score of all attempts for each user
export const calculateUserTotalScore = async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    
    // Log the received userId
    // console.log("Received userId:", userId);
    
    // Find all scores of the user and calculate total score
    const userScores = await QuizScore.find({ userId, quizId })
    
    // Log the results of the query
    // console.log("User Scores:", userScores);

    if (!userScores || userScores.length === 0) {
      return res.status(404).json({ error: "No scores found for this user" });
    }

    const totalScore = userScores.reduce((acc, score) => acc + score.totalScore, 0);

    res.status(200).json({ userId, totalScore });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate total score" });
  }
};


// Generate leaderboard with the highest total scores
export const getLeaderboard = async (req, res) => {
  try {
    const maxScore = 100;

    const leaderboard = await QuizScore.aggregate([
      { $group: { _id: "$userId", totalScore: { $sum: "$totalScore" } } },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
    ]);

    // console.log("Leaderboard aggregation result:", leaderboard); // 🔍 Debug log

    if (!leaderboard || leaderboard.length === 0) {
      console.log("No data found in leaderboard"); // 🔍 Debug log
      return res.status(404).json({ error: "No leaderboard data available" });
    }

    const leaderboardWithRankAndPercentage = leaderboard.map((entry, index) => {
      const percentage = (entry.totalScore / maxScore) * 100;
      return {
        rank: index + 1,
        userId: entry._id,
        totalScore: entry.totalScore,
        percentage: percentage.toFixed(2),
      };
    });

    // console.log("Leaderboard with percentage:", leaderboardWithRankAndPercentage); // 🔍 Debug log

    res.status(200).json(leaderboardWithRankAndPercentage);
  } catch (error) {
    console.error("Error in getLeaderboard:", error); // 🔍 Debug log
    res.status(500).json({ error: "Failed to generate leaderboard" });
  }
};



