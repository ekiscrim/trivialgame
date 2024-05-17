import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware 
app.use(express.json()); // to parse req.body
app.use(express.urlencoded({extended: true})); //to parse form data (urlencoded)

//parse request from cookie
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/rooms", roomRoutes);


app.listen(PORT, () => {
  console.log(`Server is Running in port ${PORT}`);
  connectMongoDB();
});