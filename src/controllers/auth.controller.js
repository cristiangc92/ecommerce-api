import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Registro de Usuario
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." })
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado." })
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Crear el usuario (Por defecto "customer", a menos que se especifique "admin")
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "customer"
    });

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    })
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario." })
  }
}

// Login de Usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos." })
    }

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ error: "Credenciales inválidas." })
    }

    // Comparar la contraseña ingresada con el hash de la DB
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: "Credenciales inválidas." })
    }

    // Generar Token JWT (duración de 24 horas)
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "secreto_default",
      { expiresIn: "24h" }
    )

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión." })
  }
}