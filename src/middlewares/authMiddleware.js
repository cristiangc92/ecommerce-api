import jwt from "jsonwebtoken"

//Verificar que el usuario envie un token valido
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ error: "Acceso denegato. Token no proporcionado." })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_default")
        req.user = decoded //Guardamos { id, role } en la peticion
        next()
    } catch (error) {
        return res.status(403).json({ error: "Token invalido o expirado." })
    }
}

// Verificar que el usuario tenga rol "admin"
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." })
  }
}