import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const url = process.env.URL || ""

async function connectDb(){
    try {
        
    await mongoose.connect(url);
    console.log("MongoDB Connected")
    } catch (error) {
        console.log("MongoDB Connection Error:", error)
    }
}
connectDb();

export default connectDb