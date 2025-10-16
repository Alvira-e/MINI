import React from 'react';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useAppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, user } = useAppContext();
  const navigate = useNavigate();
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some books to get started!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      alert('Please sign in to proceed to checkout');
      navigate('/signin');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border border-orange-100">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">{item.author}</p>
                    <p className="text-orange-600-600 font-bold">₹ {item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded bg-orange-100 hover:bg-orange-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 bg-orange-50 rounded">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded bg-orange-100 hover:bg-orange-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹ {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹ {(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹ {(getCartTotal() * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
            {!user && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-orange-800 text-sm">
                  <strong>Sign in required:</strong> Please sign in to proceed to checkout
                </p>
              </div>
            )}
            <button
              onClick={handleCheckout}
              className={`w-full py-2 rounded-lg transition-colors ${
                user 
                  ? 'bg-blue-500 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!user}
            >
              {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
            {!user && (
              <button
                onClick={() => navigate('/signin')}
                className="w-full mt-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Sign In Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;