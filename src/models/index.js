import { User } from "./User.js";
import { Category } from "./Category.js";
import { Product } from "./Product.js";
import { Order, OrderItem } from "./Order.js";

// Categoría <-> Productos
Category.hasMany(Product, { foreignKey: "categoryId", onDelete: "SET NULL" })
Product.belongsTo(Category, { foreignKey: "categoryId" })

// Usuario <-> Ordenes
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" })
Order.belongsTo(User, { foreignKey: "userId" })

// Orden <-> Items de la Orden
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" })
OrderItem.belongsTo(Order, { foreignKey: "orderId" })

// Producto <-> Items de la Orden
Product.hasMany(OrderItem, { foreignKey: "productId" })
OrderItem.belongsTo(Product, { foreignKey: "productId" })

export { User, Category, Product, Order, OrderItem }