import { Router } from "express";
import { getData } from "./buisness.controller.js";

const buissnesRouter = Router()

buissnesRouter.post("/", getData)

export default buissnesRouter