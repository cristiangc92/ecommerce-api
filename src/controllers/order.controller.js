import { Order, OrderItem, Product } from '../models/index.js';
import { sequelize } from '../config/db.js';

// Crear una orden (Checkout)
export const createOrder = async (req, res) => {
  const t = await sequelize.transaction() // Usamos transacción para asegurar consistencia en stock y orden
  try {
    const { items } = req.body // Array de { productId, quantity }
    const userId = req.user.id // Obtenido del token JWT

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" })
    }

    let total = 0
    const orderItemsData = []

    // Validar stock y calcular total
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t })
      if (!product) {
        await t.rollback()
        return res.status(404).json({ error: `Producto con ID ${item.productId} no encontrado` })
      }

      if (product.stock < item.quantity) {
        await t.rollback()
        return res.status(400).json({ error: `Stock insuficiente para el producto: ${product.title}` })
      }

      const itemTotal = Number(product.price) * item.quantity
      total += itemTotal

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })

      // Descontar stock
      product.stock -= item.quantity
      await product.save({ transaction: t })
    }

    // Crear la Orden
    const newOrder = await Order.create({
      userId,
      total,
      status: "completed",
    }, { transaction: t })

    // Crear los OrderItems asociados
    for (const itemData of orderItemsData) {
      await OrderItem.create({
        ...itemData,
        orderId: newOrder.id,
      }, { transaction: t })
    }

    await t.commit()
    res.status(201).json({ message: "Orden creada con éxito", orderId: newOrder.id, total })
  } catch (error) {
    await t.rollback()
    res.status(500).json({ error: "Error al procesar la compra" })
  }
}

// Obtener las órdenes del usuario autenticado
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const orders = await Order.findAll({
      where: { userId },
      include: {
        model: OrderItem,
        include: { model: Product, attributes: ["title", "image", "price"] },
      },
      order: [["createdAt", "DESC"]],
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las órdenes" })
  }
}