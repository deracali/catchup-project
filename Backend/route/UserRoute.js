import express from "express";
import { signup, login, getProfile, getUsers, updateTimeSpent, getUserData, updateUser, deleteUser } from "../controller/UserController.js";


const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.get("/profile/:id", getProfile);
UserRouter.get("/", getUsers);
UserRouter.put("/update/:userid", updateUser);
UserRouter.post('/update-time-spent', updateTimeSpent);
UserRouter.get('/user-data/:userId', getUserData);
UserRouter.delete("/delete/:userid", deleteUser);


export default UserRouter;
