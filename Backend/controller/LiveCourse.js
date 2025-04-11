import Course from "../model/LiveCourse.js";

// Get all courses
 const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    const currentDate = new Date().toISOString().split("T")[0];

    const updatedCourses = courses.map((course) => ({
      ...course._doc,
      status: course.date === currentDate ? "Live Class" : "Join Now"
    }));

    res.status(200).json(updatedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single course by ID
// const getCourseById = async (req, res) => {
//   try {
//     // Access teacherId from the request parameters
//     const { teacherId } = req.params;

//     // Fetch courses for the teacher
//     const courses = await Course.find({ teacherId });

//     if (!courses.length) {
//       return res.status(404).json({ message: "No courses found for this teacher." });
//     }

//     const currentDate = new Date().toISOString().split("T")[0];

//     // Map through courses and update status
//     const updatedCourses = courses.map(course => ({
//       ...course._doc,
//       status: course.date === currentDate ? "Live Class" : "Join Now",
//     }));

//     res.status(200).json(updatedCourses);
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

const getCourseById = async (req, res) => {
  try {
    // Access teacherId from the request parameters
    const { teacherId } = req.params;

    // Fetch courses for the teacher
    const courses = await Course.find({ teacherId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this teacher." });
    }

    // Return the fetched courses without modification
    res.status(200).json(courses);

  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


// Create a new course
const createCourse = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log incoming request data

    const {
      title,
      date,
      lessons,
      totalCost,
      studentsCount,
      lessonCount,
      time,
      teacherId,
      googleMeetLink // Destructure new field
    } = req.body;

    // Create a new course document
    const newCourse = new Course({
      title,
      date,
      lessons,
      totalCost,
      studentsCount: studentsCount || 0, // Default to 0 if not provided
      lessonCount,
      time,
      teacherId,
      googleMeetLink // Add to schema
    });

    // Save the new course to the database
    await newCourse.save();

    console.log("Course successfully created:", newCourse);
    res.status(201).json(newCourse); // Return the created course
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};



// Update an existing course
 const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a course
 const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Allow user to join a course
 const joinCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.studentsCount += 1; // Increment student count
    await course.save();

    res.status(200).json({ message: "Successfully joined course", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {getCourses, getCourseById ,createCourse, joinCourse, deleteCourse, updateCourse}