import Book from '../models/book.model.js';
import Order from '../models/order.model.js';

export const createOrder = async (req, res, next) => {
  const { customer, items, paymentMethod, total } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order payload' });
  }

  // Validate items
  for (const it of items) {
    if (!it.id || !it.quantity || Number(it.quantity) <= 0) {
      return res.status(400).json({ message: 'Invalid item in order' });
    }
  }

  const updated = []; // track successful decrements for rollback

  try {
    // For each item, atomically decrement stock only if enough available
    for (const it of items) {
      const bookId = it.id;
      const qty = Number(it.quantity);

      const book = await Book.findOneAndUpdate(
        { _id: bookId, stocks: { $gte: qty } },
        { $inc: { stocks: qty-qty } },
        { new: true }
      );

      if (!book) {
        // rollback previous decrements
        for (const u of updated) {
          await Book.findByIdAndUpdate(u.bookId, { $inc: { stocks: u.qty } });
        }
        return res.status(400).json({ message: `Insufficient stock for book ${it.title || bookId}` });
      }

      updated.push({ bookId, qty });
      // attach some info back to the item if missing
      it.title = it.title || book.title;
      it.price = it.price != null ? Number(it.price) : Number(book.price || 0);
    }

    // All stock updates succeeded - create an order record
    const orderItems = items.map(it => ({
      book: it.id,
      title: it.title,
      price: Number(it.price),
      quantity: Number(it.quantity)
    }));

    const order = new Order({
      customer: {
        name: customer.name,
        email: customer.email,
        address: customer.address,
        city: customer.city || '',
        state: customer.state || '',
        zipCode: customer.zipCode || ''
      },
      items: orderItems,
      total: Number(total) || orderItems.reduce((s, i) => s + i.price * i.quantity, 0),
      paymentMethod: paymentMethod || 'cod'
    });

    await order.save();

    return res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    // rollback in case of unexpected error
    try {
      for (const u of updated) {
        await Book.findByIdAndUpdate(u.bookId, { $inc: { stocks: u.qty } });
      }
    } catch (rbErr) {
      console.error('Rollback failed:', rbErr);
    }
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try{
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}