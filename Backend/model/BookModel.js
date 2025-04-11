import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Accepted", "Rejected"],
      default: "Pending",
    },
    googleMeetLink: { type: String },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
