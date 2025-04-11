import Booking from "../model/BookModel.js";
import Teacher from "../model/TeachersModel.js";

// ✅ Book a Teacher
export const bookTeacher = async (req, res) => {
  try {
    const { teacherId, userId, date, time, description, googleMeetLink, status } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const newBooking = new Booking({
      teacherId,
      teacherName: teacher.name,
      userId,
      date,
      time,
      description,
      googleMeetLink: googleMeetLink || "", // Optional
      status: status || "Pending" // Defaults to Pending if not passed
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("teacherId", "name").populate("userId", "name email");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("teacherId", "name").populate("userId", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Bookings by Teacher ID
export const getBookingsByTeacher = async (req, res) => {
  try {
    const bookings = await Booking.find({ teacherId: req.params.teacherId }).populate("userId", "name email");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Booking
export const updateBooking = async (req, res) => {
  try {
    const { date, time, description, status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.date = date || booking.date;
    booking.time = time || booking.time;
    booking.description = description || booking.description;
    booking.status = status || booking.status;

    await booking.save();
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ Accept or Reject Booking
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // status should be "Accepted" or "Rejected"

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Accepted' or 'Rejected'" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: `Booking ${status.toLowerCase()} successfully`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
