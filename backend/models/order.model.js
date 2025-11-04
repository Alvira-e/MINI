import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: String,
    state: String,
    zipCode: String,
  },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'cod' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;