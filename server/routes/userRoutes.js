import express from "express";

import { protect } from "../middleware/auth.js";
import { getUserData,loginUser,registerUser, changeRoleToOwner,getTrainers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data',protect,getUserData)
userRouter.post("/change-role", protect, changeRoleToOwner);
userRouter.get('/Trainers',getTrainers)
export default userRouter;