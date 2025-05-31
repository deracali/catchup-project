import Quiz from "../model/QuizModel.js";

// Create multiple quiz questions

export const createQuizzes = async (req, res) => {
  try {
    const { quizzes } = req.body;

    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      console.error("Validation Error: Quizzes array is required");
      return res.status(400).json({
        message: "A non-empty array of quizzes is required"
      });
    }

    const formattedQuizzes = quizzes.map((quiz) => {
      const { title, category, questions } = quiz;

      if (!title || !category || !Array.isArray(questions) || questions.length === 0) {
        console.error("Validation Error: Title, category, and questions are required for each quiz");
        throw new Error("Each quiz must have a title, category, and at least one question");
      }

      if (!["Primary", "Secondary"].includes(category)) {
        console.error("Validation Error: Invalid category", category);
        throw new Error("Category must be 'Primary' or 'Secondary'");
      }

      const validatedQuestions = questions.map((q) => {
        const {
          question,
          options,
          answer,
          explanation = "",
          subject,
          type,
          timeLimit
        } = q;

        if (!question || !options || !answer || !subject || !type || timeLimit == null) {
          console.error("Validation Error: Missing required fields in question", q);
          throw new Error("Each question must include question, options, answer, subject, type, and timeLimit");
        }

        if (!Array.isArray(options) || options.length < 2) {
          console.error("Validation Error: Options must be an array with at least 2 items", q);
          throw new Error("Each question must have at least two options");
        }

        if (!options.includes(answer)) {
          console.error("Validation Error: Answer must be one of the options", answer);
          throw new Error("Answer must be one of the provided options");
        }

        if (typeof timeLimit !== "number" || timeLimit <= 0) {
          console.error("Validation Error: Invalid timeLimit", timeLimit);
          throw new Error("timeLimit must be a positive number");
        }

        if (typeof type !== "string" || type.trim() === "") {
          console.error("Validation Error: Invalid type", type);
          throw new Error("Each question must have a non-empty string 'type'");
        }

        return {
          question,
          options,
          answer,
          explanation,
          subject,
          type,
          timeLimit
        };
      });

      return {
        title,
        category,
        questions: validatedQuestions
      };
    });

    const insertedQuizzes = await Quiz.insertMany(formattedQuizzes);

    console.log("Inserted quizzes successfully:", insertedQuizzes);
    res.status(201).json({
      message: "Quizzes added successfully",
      quizzes: insertedQuizzes
    });

  } catch (error) {
    console.error("Create Quizzes Error:", error.message, error.stack);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
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


