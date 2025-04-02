import QuizScore from "../model/QuizDataModel.js";

// Add a new quiz score
export const addQuizScore = async (req, res) => {
  try {
    // Log incoming data to inspect what is being sent
    console.log('Request body:', req.body);

    const { userId, quizId, totalScore } = req.body;

    // Create the new quiz score entry
    const newScore = new QuizScore({ userId, quizId, totalScore });

    // Log the created score object before saving
    console.log('New Score to be saved:', newScore);

    // Save the new score to the database
    await newScore.save();

    // Respond with success message
    res.status(201).json({ message: "Score added successfully", score: newScore });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error saving score:', error);

    // Respond with failure message
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
