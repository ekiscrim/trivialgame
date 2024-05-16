import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware 
app.use(express.json()); // to parse req.body
app.use(express.urlencoded({extended: true})); //to parse form data (urlencoded)

//parse request from cookie
app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server is Running in port ${PORT}`);
  connectMongoDB();
});