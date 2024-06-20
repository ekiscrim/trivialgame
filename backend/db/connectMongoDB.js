// connectMongoDB.js
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const mongoStore = MongoStore.create({
            mongoUrl: process.env.MONGO_URI, // URL de conexión a MongoDB
            collectionName: "sessions", // Nombre de la colección donde se guardarán las sesiones
            ttl: 7 * 24 * 60 * 60, // Tiempo de vida de la sesión en segundos
            autoRemove: "native", // Opción adicional para configurar el auto-remover
            mongoOptions: { } // Opciones de conexión de MongoDB
        });

        console.log(`Conectado a MongoDB: ${mongoose.connection.host}`);
        return mongoStore; // Devuelve la instancia de MongoStore
    } catch (error) {
        console.error(`Error al conectarse a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectMongoDB;
