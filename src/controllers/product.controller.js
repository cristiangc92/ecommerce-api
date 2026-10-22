import { Product, Category } from '../models/index.js';
import { Op } from 'sequelize';

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" })
  }
}

// Crear categoría (Solo Admin)
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: "El nombre de la categoría es requerido" })

    const newCategory = await Category.create({ name })
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ error: "Error al crear la categoría" })
  }
}

// Obtener todos los productos (con filtros opcionales por categoría o búsqueda de título)
export const getProducts = async (req, res) => {
  try {
    const { categoryId, search } = req.query
    let whereCondition = {}

    if (categoryId) {
      whereCondition.categoryId = categoryId
    }

    if (search) {
      whereCondition.title = { [Op.iLike]: `%${search}%` } // Búsqueda insensible a mayúsculas
    }

    const products = await Product.findAll({
      where: whereCondition,
      include: { model: Category, attributes: ["id", "name"] },
      order: [["createdAt", "DESC"]]
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" })
  }
}

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id, {
      include: { model: Category, attributes: ["id", "name"] },
    })

    if (!product) return res.status(404).json({ error: "Producto no encontrado" })

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" })
  }
}

// Crear producto (Solo Admin)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, image, categoryId } = req.body

    if (!title || !price || !categoryId) {
      return res.status(400).json({ error: "Título, precio y categoría son obligatorios" })
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      stock: stock || 0,
      image,
      categoryId
    })

    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" })
  }
}

// Actualizar producto (Solo Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, price, stock, image, categoryId } = req.body

    const product = await Product.findByPk(id)
    if (!product) return res.status(404).json({ error: "Producto no encontrado" })

    if (title !== undefined) product.title = title
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = price
    if (stock !== undefined) product.stock = stock
    if (image !== undefined) product.image = image
    if (categoryId !== undefined) product.categoryId = categoryId

    await product.save()
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" })
  }
}

// Eliminar producto (Solo Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } })

    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" })

    res.json({ message: "Producto eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" })
  }
}