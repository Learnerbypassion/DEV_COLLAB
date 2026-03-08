import express from "express"
import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import cookieParser from "cookie-parser"
import projectRoutes from "./routes/project.routes.js"
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/project', projectRoutes)

app.get('/', (req, res)=>{
    res.send("This is backend of Dev-Collab");
    
})

export default app;