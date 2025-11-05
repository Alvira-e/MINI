import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Book, ShoppingCart } from 'lucide-react';
import { useAppContext } from './AppContext';

export default function BookAdminPanel() {
  const { rawBooks: books, addBook, deleteBook, updateBook, updateBookStock, categories: bookCategories } = useAppContext();

  const [activeTab, setActiveTab] = useState('books');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    photo: '',
    description: '',
    rating: '',
    stock: '',
    price: '',
    author: '',
    category: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null); // For the actual file object
  const [stockInputs, setStockInputs] = useState({}); // Local state for stock inputs
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      setPhotoFile(file); // Store the file object
    }
  };

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      photo: '',
      description: '',
      rating: '',
      stock: '',
      price: '',
      author: '',
      category: ''
    });
    setPhotoPreview(null);
    setPhotoFile(null);
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      photo: book.image,
      description: book.description,
      rating: book.rating?.toString() ?? '',
      stock: (book.stocks ?? 0).toString(),
      price: (book.price ?? '').toString(),
      author: book.author,
      category: book.category
    });
    setPhotoPreview(book.image); // book.image expected to be absolute URL
    setPhotoFile(null); // No file initially when editing
    setShowModal(true);
  };

  const handleSubmit = async () => {
  if (
    !formData.title ||
    (!photoFile && !editingBook) ||
    !formData.description ||
    !formData.author ||
    !formData.category ||
    !formData.rating ||
    formData.stock === '' ||
    !formData.price
  ) {
    alert('Please fill all fields');
    return;
  }

  const bookFormData = new FormData();
  bookFormData.append('title', formData.title);
  bookFormData.append('description', formData.description);
  bookFormData.append('author', formData.author);
  bookFormData.append('category', formData.category);
  bookFormData.append('rating', formData.rating);
  bookFormData.append('stocks', formData.stock);
  bookFormData.append('price', formData.price);
  if (photoFile) {
    bookFormData.append('image', photoFile);
  }

  try {
    if (editingBook) {
      // call update endpoint
      await updateBook(editingBook.id, bookFormData);
    } else {
      await addBook(bookFormData);
    }

    setShowModal(false);
    setEditingBook(null);
    setFormData({
      title: '',
      photo: '',
      description: '',
      rating: '',
      stock: '',
      price: '',
      author: '',
      category: ''
    });
    setPhotoFile(null);
    setPhotoPreview(null);
  } catch (err) {
    console.error('Error adding/updating book:', err);
    alert(err.message || 'Could not add/update book');
  }
};


  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Could not delete book');
      }
    }
  };

  const handleStockInputChange = (bookId, value) => {
    setStockInputs(prev => ({ ...prev, [bookId]: value }));
  };

  const handleUpdateStock = async (id) => {
    const newStockValue = stockInputs[id];
    if (newStockValue === undefined || newStockValue === '' || isNaN(newStockValue)) {
      alert('Please enter a valid stock number.');
      return;
    }
    const delta = parseInt(newStockValue, 10) - (books.find(b => b.id === id)?.stocks || 0);
    try {
      await updateBookStock(id, delta);
      setStockInputs(prev => { const { [id]: _, ...rest } = prev; return rest; }); // Clear local state on success
    } catch (err) {
      alert(err.message || 'Could not update stock');
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/checkout/getorders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) {
            throw new Error('Failed to fetch orders');
          }
          const data = await res.json();
          setOrders(data);
        } catch (err) {
          console.error(err);
          alert(err.message);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Book Admin Panel</h1>
          {activeTab === 'books' && (
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Book
            </button>
          )}
        </div>

        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('books')}
              className={`${activeTab === 'books' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Book size={16} /> Books
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${activeTab === 'orders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <ShoppingCart size={16} /> Orders
            </button>
          </nav>
        </div>

        {activeTab === 'books' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Photo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{book.description}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{book.author}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{book.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{(book.rating ?? 0).toFixed(1)} ⭐</td>
                    <td className="px-4 py-3 text-gray-700">₹{(book.price ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={stockInputs[book.id] ?? book.stocks ?? 0}
                        onChange={(e) => handleStockInputChange(book.id, e.target.value)}
                        className="w-20 px-2 py-1 border rounded"
                        min="0"
                      />
                      {stockInputs[book.id] !== undefined && (
                        <button
                          onClick={() => handleUpdateStock(book.id)}
                          className="p-1 ml-1 text-green-600 hover:bg-green-100 rounded"
                          title="Save stock"
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(book)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            {ordersLoading ? (
              <div className="p-6 text-center">Loading orders...</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">...{order._id.slice(-6)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <ul>
                          {order.items.map(item => (
                            <li key={item.id}>{item.title} (x{item.quantity})</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 font-medium">₹{order.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded ${order.paymentMethod === 'cod' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                  {photoPreview && (
                    <div className="mt-2">
                      <img src={photoPreview} alt="Preview" className="w-32 h-40 object-cover rounded border" />
                    </div>
                  )}
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    list="category-suggestions"
                    placeholder="Type or select a category"
                  />
                  <datalist id="category-suggestions">
                    {bookCategories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}