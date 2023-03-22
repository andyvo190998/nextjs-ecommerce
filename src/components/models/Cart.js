import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  cart: [
    {
      itemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: String, required: true },
      countInStock: { type: Number, required: true },
    },
  ],
});

const Cart2 = mongoose.models.Cart2 || mongoose.model('Cart2', cartSchema);

export default Cart2;
