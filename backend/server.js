import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import questionRoutes from "./routes/question.routes.js";
import resultsRoutes from "./routes/score.routes.js";

import adminRoutes from "./routes/admin/admin.routes.js"

import connectMongoDB from "./db/connectMongoDB.js";
import {v2 as cloudinary} from "cloudinary";
import bodyParser from "body-parser";
import multer from "multer"

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();
const PORT = process.env.PORT || 5000;

//middleware 
app.use(express.json()); // to parse req.body
app.use(express.urlencoded({extended: true})); //to parse form data (urlencoded)

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

// Configurar multer para la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB límite



//parse request from cookie
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/rooms/:id", questionRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/questions", upload.single('image'), questionRoutes);
app.use("/api/validate", questionRoutes);
app.use("/api/room/:roomId", resultsRoutes);
app.use("/api/room", resultsRoutes);
app.use("/api/scores", resultsRoutes);


//admin
app.use('/api/admin', adminRoutes);


app.listen(PORT, () => {
  console.log(`Server is Running in port ${PORT}`);
  connectMongoDB();
});