import express from "express";
import {
  bookTeacher,
  getAllBookings,
  getBookingById,
  getBookingsByTeacher,
  updateBooking,
  deleteBooking,
} from "../controller/BookController.js";

const BookRoute = express.Router();

// ✅ Route to book a teacher
BookRoute.post("/book", bookTeacher);

// ✅ Route to get all bookings
BookRoute.get("/bookings", getAllBookings);

// ✅ Route to get booking by ID
BookRoute.get("/bookings/:id", getBookingById);

// ✅ Route to get bookings by teacher ID
BookRoute.get("/bookings/teacher/:teacherId", getBookingsByTeacher);

// ✅ Route to update a booking
BookRoute.put("/bookings/:id", updateBooking);

// ✅ Route to delete a booking
BookRoute.delete("/bookings/:id", deleteBooking);

export default BookRoute;
