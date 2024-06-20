import path from "path";
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
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from "./routes/admin/admin.routes.js";
import session from "express-session"; // Importa express-session
import passport from "passport"; // Importa passport
import "./config/passport.js"; // Importa y configura passport y GoogleStrategy
import connectMongoDB from "./db/connectMongoDB.js";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser"; // TODO eliminar en el futuro
import multer from "multer";
import MongoStore from "connect-mongo";

//crons
import './tasks/update.room.status.cron.js';
import './tasks/reset.scores.cron.js';
import './tasks/remove.room.old.cron.js';
import './tasks/remove.old.notifications.cron.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

//middleware 
app.use(express.json({ limit: '200mb' })); // to parse req.body
app.use(express.urlencoded({ extended: false, limit: '50mb' })); //to parse form data (urlencoded)

// Configurar multer para la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB límite

// Inicializar sesión
(async () => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        store: await connectMongoDB(), // Usa connectMongoDB para el almacenamiento de sesiones
    }));

    // Inicializar passport
    app.use(passport.initialize());
    app.use(passport.session());

    //parse request from cookie
    app.use(cookieParser());

    // Rutas de autenticación y otras rutas
    app.use("/api/auth", authRoutes);
    app.use("/api/users", upload.single('profileImg'), userRoutes);
    app.use("/api/category", categoryRoutes);
    app.use("/api/questions", upload.single('image'), questionRoutes);
    app.use("/api/rooms", roomRoutes);
    app.use("/api/scores", resultsRoutes);
    app.use("/api/statistic", statisticsRoutes);
    app.use("/api/rankings", rankingRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/admin', adminRoutes);

    // Configurar rutas estáticas en producción
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, "/frontend/dist")));
        app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
        });
    }

    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Server is Running in port ${PORT}`);
    });
})();