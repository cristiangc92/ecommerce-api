import { Sequelize } from "sequelize";
import dotenv, { config } from "dotenv"

dotenv.config()

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false
})

export const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log("Conexion exitosa a la base de datos del E-commerce")
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error)
    }
}