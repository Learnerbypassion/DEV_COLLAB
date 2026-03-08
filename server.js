import app from "./src/app.js"
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 4000;

connectDB()
app.listen(PORT , ()=>{
    console.log("The server is running " + PORT);
    console.log("http://localhost:" + PORT);
})