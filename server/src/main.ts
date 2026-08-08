import express from "express"
import cors from "cors"
import { connectDB } from "./utils/database.js"
import siteRouter from "./modules/site/site.route.js"
import userRouter from "./modules/user/user.router.js"
import buissnesRouter from "./modules/buisneses/buisness.route.js"
import deserializeUser from "./middleware/deserializeUser.js"

const app = express()

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/user", userRouter)

app.use(deserializeUser)

app.use("/site", siteRouter)
app.use("/buisnesses", buissnesRouter)
app.use("/businesses", buissnesRouter)

const port = process.env.PORT || 4000

const server = app.listen(port, async () => {
    connectDB()
    console.log(`server is running on ${port}`)
})