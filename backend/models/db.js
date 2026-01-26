import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const db = require('./index.cjs');

export const { 
    User,
    Cart,
    Brand,
    Address,
    Item,
    ItemCategory,
    ItemImage,
    Message,
    Notification,
    Order,
    OrderItem,
    Product,
    ProductCategory,
    ProductImage,
    PromoCode,
    Review,
    Wishlist,
    Comment,
} = db;
export default db;