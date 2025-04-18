import Booking from "../model/BookModel.js";
import Teacher from "../model/TeachersModel.js";
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 587,  // Use 465 for SSL if needed
  secure: false, // Set to `true` if using port 465
  auth: {
      user: 'info@catchuped.com',  // Your Titan Mail email
      pass: 'Studenthouse2020@' // Your Titan Mail password
  }
});  

const sendTeacherEmail = async (to, teacherName, date, time) => {
  const mailOptions = {
    from: 'info@catchuped.com',
    to,
    subject: 'New Booking Received!',
    html: `
      <div style="font-family: Arial, sans-serif; background: #f5f7fa; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px;">
          <h2 style="color: #333;">Hi ${teacherName},</h2>
          <p style="color: #555;">You've received a new booking for:</p>
          <ul style="color: #333;">
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
          </ul>
          <p style="color: #555;">Please log in to your dashboard to manage the session.</p>
          <div style="margin-top: 20px;">
            <a href="https://catchuped.com/dashboard" style="background-color: #4a6cf7; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">Go to Dashboard</a>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Booking email sent to ${to}`);
  } catch (error) {
    console.error('❌ Booking email error:', error);
  }
};



// ✅ Book a Teacher
export const bookTeacher = async (req, res) => {
  try {
    const { teacherId, userId, date, time, description, googleMeetLink, status } = req.body;

    // ✅ Fetch the teacher and get email
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const newBooking = new Booking({
      teacherId,
      teacherName: teacher.name,
      userId,
      date,
      time,
      description,
      googleMeetLink: googleMeetLink || "",
      status: status || "Pending"
    });

    await newBooking.save();

    // ✅ Send email to teacher
    await sendTeacherEmail(teacher.email, teacher.name, date, time);

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
    });
  } catch (error) {
    console.error("Booking Error:", error);
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
    const { status, googleMeetLink } = req.body; // also get googleMeetLink

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Accepted' or 'Rejected'" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;

    // Update googleMeetLink only if it's provided
    if (googleMeetLink) {
      booking.googleMeetLink = googleMeetLink;
    }

    await booking.save();

    res.status(200).json({
      message: `Booking ${status.toLowerCase()} successfully`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// ✅ Get Bookings by User ID
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId })
      .populate("teacherId", "name email")
      .populate("userId", "name email");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
