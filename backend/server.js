import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import questionRoutes from "./routes/question.routes.js";
import resultsRoutes from "./routes/score.routes.js";
import statisticsRoutes from "./routes/user.statistic.routes.js"; 
import rankingRoutes from "./routes/ranking.routes.js";

import adminRoutes from "./routes/admin/admin.routes.js"

import connectMongoDB from "./db/connectMongoDB.js";
import {v2 as cloudinary} from "cloudinary";
import bodyParser from "body-parser"; // TODO eliminar en el futuro
import multer from "multer"

//crons
import './tasks/update.room.status.cron.js';
import './tasks/reset.scores.cron.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();
const PORT = process.env.PORT || 5000;

//middleware 
app.use(express.json({limit: '200mb'})); // to parse req.body
app.use(express.urlencoded({extendend: false, limit: '50mb'}));//to parse form data (urlencoded)

// Configurar multer para la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB límite



//parse request from cookie
app.use(cookieParser());

app.use("/api/auth", authRoutes);  // Autenticación de usuario
app.use("/api/users", upload.single('profileImg'), userRoutes);  // Gestión de usuarios
app.use("/api/category", categoryRoutes);  // Operaciones relacionadas con categorías
app.use("/api/questions", upload.single('image'), questionRoutes);  // Operaciones relacionadas con preguntas
app.use("/api/question", questionRoutes);  // Operaciones específicas de una pregunta
app.use("/api/validate", questionRoutes);  // Validación de respuestas
app.use("/api/rooms/:id", questionRoutes);  // Operaciones específicas de una sala de preguntas
app.use("/api/rooms", roomRoutes);  // Operaciones relacionadas con salas de preguntas
app.use("/api/participant", questionRoutes);  // Operaciones relacionadas con participantes
app.use("/api/room/:roomId", resultsRoutes);  // Resultados específicos de una sala
app.use("/api/room", resultsRoutes);  // Operaciones relacionadas con salas de resultados
app.use("/api/scores", resultsRoutes);  // Puntuaciones generales
app.use("/api/statistic", statisticsRoutes) //Estadisticas de usuario
app.use("/api/rankings", rankingRoutes); //Ranking de usuarios

//admin
app.use('/api/admin', adminRoutes);


app.listen(PORT, () => {
  console.log(`Server is Running in port ${PORT}`);
  connectMongoDB();
});