import QuizScore from "../model/QuizDataModel.js";
import User from "../model/UserModel.js";

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
    const { userId } = req.params;
    
    // Find all scores for the given userId
    const userScores = await QuizScore.find({ userId });

    // If no scores are found, return an error
    if (!userScores || userScores.length === 0) {
      return res.status(404).json({ error: "No scores found for this user" });
    }

    // Calculate the total score by summing all the individual scores
    const totalScore = userScores.reduce((acc, score) => acc + score.totalScore, 0);

    // Return the total score for the user
    res.status(200).json({ userId, totalScore });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate total score" });
  }
};


// Generate leaderboard with the highest total scores
export const getLeaderboard = async (req, res) => {
  try {
    const maxScore = 100;

    // 1. Find all quiz scores
    const scores = await QuizScore.find();

    if (!scores || scores.length === 0) {
      return res.status(404).json({ error: "No quiz scores found" });
    }

    // 2. Group scores by userId
    const scoreMap = {};

    scores.forEach((score) => {
      const userId = score.userId.toString();
      if (!scoreMap[userId]) {
        scoreMap[userId] = 0;
      }
      scoreMap[userId] += score.totalScore;
    });

    // 3. Create leaderboard array
    let leaderboardArray = [];

    for (const userId in scoreMap) {
      const user = await User.findById(userId).lean();
      if (user) {
        leaderboardArray.push({
          userId,
          name: user.name,
          email: user.email,
          image: user.image,
          totalScore: scoreMap[userId],
          percentage: ((scoreMap[userId] / maxScore) * 100).toFixed(2),
        });
      }
    }

    // 4. Sort leaderboard by totalScore
    leaderboardArray.sort((a, b) => b.totalScore - a.totalScore);

    // 5. Add rank
    leaderboardArray = leaderboardArray.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    // 6. Limit to top 10
    const top10 = leaderboardArray.slice(0, 10);

    res.status(200).json(top10);
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    res.status(500).json({ error: "Failed to generate leaderboard" });
  }
};