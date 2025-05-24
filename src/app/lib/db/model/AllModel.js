import mongoose from "mongoose";

// 1. User Model (WITH ADDRESS)

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "admin", "cook", "delivery"], 
    default: "user" 
  },
  phone: { type: String }, // For delivery contact
  addresses: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    isDefault: { type: Boolean, default: false }
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
}, { timestamps: true });

// 2. Category Model (Fixed: Mutton, Beef, Chicken, Fish)
const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    enum: ["mutton", "beef", "chicken", "fish"], 
    required: true,
    unique: true 
  },
  description: { type: String },
}, { timestamps: true });

// 3. Food Item Model (Dishes under categories)
const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ["mutton", "beef", "chicken", "fish"], 
    required: true 
  },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 }, // Track inventory
}, { timestamps: true });

// 4. Order Model (With delivery address and notes)
const OrderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  deliveryAddress: { // Snapshot of address at order time
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
  },
  contactPhone: { type: String, required: true }, // Alternate contact
  items: [{
    foodItem: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "FoodItem", 
      required: true 
    },
    quantity: { type: Number, default: 1 }
  }],
  status: { 
    type: String, 
    enum: ["pending", "cooking", "on-the-way", "delivered"],
    default: "pending" 
  },
  paymentMethod: { 
    type: String, 
    enum: ["cod", "online"], 
    required: true 
  },
  totalPrice: { type: Number, required: true },
  deliveryNotes: { type: String }, // Special instructions (e.g., "Leave at gate")
}, { timestamps: true });

// Export all models
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export const FoodItem = mongoose.models.FoodItem || mongoose.model("FoodItem", FoodItemSchema);
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);