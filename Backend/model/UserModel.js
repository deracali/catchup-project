import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    image: {
      type: String,
      default: "https://media.istockphoto.com/id/2149922267/vector/user-icon.webp?a=1&b=1&s=612x612&w=0&k=20&c=eftd9nEYQYSWX_yZsHtkoo47x5l_Jp_2b-J4iD1pGPY=", // Default image URL
    },
     role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscriptions: {
      type: [
        {
          plan: { type: String, required: true }, // e.g., "Basic", "Premium"
          startDate: { type: Date, default: Date.now },
          endDate: { type: Date, required: true }, // Subscription expiration
        },
      ],
      default: [],
    },
    totalTimeSpent: {
      type: Number, // Time in seconds
      default: 0, // Tracks the total time the user has spent on the website
    },
    level: {
      type: Number,
      default: 1, // Level starts at 1
    },
  },
  { timestamps: true } // This enables createdAt and updatedAt fields
);

const User = mongoose.model("User", UserSchema);
export default User;
