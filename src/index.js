import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { sequelize, connectDB } from "./config/db.js"
import "./models/index.js"
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

app.get("/api/prueba", (req, res) => {
    res.json({ status: "ok", message: "API E-commerce funcionando correctamente" })
})

const startServer = async () => {
    await connectDB()
    await sequelize.sync({ alter: true })
    console.log("Modelos de E-commerce sincronizados con PostgreSQL")

    app.listen(PORT, () => {
        console.log(`Servidor de E-commerce corriendo en el puerto: ${PORT}`)
    })
}

startServer()