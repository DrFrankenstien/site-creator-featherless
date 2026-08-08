import { Router } from "express";
import { loginuser } from "./user.controller.js";
import deserializeUser from "../../middleware/deserializeUser.js";

const userRouter = Router()


userRouter.post('/login', loginuser)

export default userRouter