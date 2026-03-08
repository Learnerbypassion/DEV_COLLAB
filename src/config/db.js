import mongoose from "mongoose";
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Data-Base is connected");
        
    } catch (error) {
        console.log("Data-Base connection error ", error);
        
    }
}


export default connectDB;