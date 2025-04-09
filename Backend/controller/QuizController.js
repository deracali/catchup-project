import Quiz from "../model/QuizModel.js";

// Create multiple quiz questions

export const createQuizzes = async (req, res) => {
  try {
    const { title, category, quizzes } = req.body; // 'category' should be on the quiz level
    console.log("Received quiz data:", { title, category, quizzes }); // Log received data

    // Validate the required fields
    if (!title || !category || !Array.isArray(quizzes) || quizzes.length === 0) {
      console.error("Validation Error: Quiz title, category, and questions must be provided");
      return res.status(400).json({ message: "Quiz title, category, and at least one question are required" });
    }

    // Validate the category field at the quiz level
    if (!["Primary", "Secondary"].includes(category)) {
      console.error("Validation Error: Invalid category", category);
      return res.status(400).json({ message: "Category must be 'Primary' or 'Secondary'" });
    }

    for (const quiz of quizzes) {
      // Validate each question
      const { question, options, answer, subject, timeLimit } = quiz;
      if (!question || !options || !answer || !subject || !timeLimit) {
        console.error("Validation Error: Missing fields in quiz question", quiz);
        return res.status(400).json({ message: "All fields are required for each question" });
      }

      // Validate options and answer
      if (!options.includes(answer)) {
        console.error("Validation Error: Answer must be one of the options", answer);
        return res.status(400).json({ message: "Answer must be one of the options" });
      }
    }

    // Prepare the quiz document to be inserted, now with category at the quiz level
    const quizData = {
      title,
      category, // The category is now added here at the quiz level
      questions: quizzes, // Insert the questions array directly into the quiz document
    };

    // Insert the quiz into the database
    const newQuiz = new Quiz(quizData);
    await newQuiz.save();

    console.log("Inserted quiz successfully:", newQuiz);

    res.status(201).json({ message: "Quiz added successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Create Quiz Error:", error.message, error.stack);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all quiz questions
export const getQuizzes = async (req, res) => {
  try {
    const allQuizzes = await Quiz.find();
    res.status(200).json(allQuizzes);
  } catch (error) {
    console.error("Fetch Quizzes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get quiz questions by category
export const getQuizzesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!["Primary", "Secondary"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    const quizzes = await Quiz.find({ "quizzes.category": category });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Fetch Quiz By Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update a specific quiz question
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, answer, subject, category, timeLimit } = req.body;

    // Validate required fields
    if (!question || !options || !answer || !subject || !category || !timeLimit) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate category
    if (!["Primary", "Secondary"].includes(category)) {
      return res.status(400).json({ message: "Category must be 'Primary' or 'Secondary'" });
    }

    // Find and update the quiz
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { question, options, answer, subject, category, timeLimit },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    console.error("Update Quiz Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get quiz questions by subject
export const getQuizzesBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const quizzes = await Quiz.find({ "quizzes.subject": subject });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Fetch Quiz By Subject Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get a specific quiz by its ID
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;  // Extract the quiz ID from the URL parameters
    const quiz = await Quiz.findById(id);  // Find the quiz by ID

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });  // Return an error if the quiz doesn't exist
    }

    res.status(200).json(quiz);  // Return the quiz data if found
  } catch (error) {
    console.error("Fetch Quiz By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// Delete a specific quiz question
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Delete Quiz Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


