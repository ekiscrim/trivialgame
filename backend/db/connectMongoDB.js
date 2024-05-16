import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conectado a MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error al conectarse a MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectMongoDB;