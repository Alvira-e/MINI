import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Username validation: cannot be only numbers
    if (/^\d+$/.test(formData.name)) {
      alert('Username cannot consist only of numbers.');
      return;
    }

    // Password validation
    const passwordErrors = [];
    if (formData.password.length < 8) {
      passwordErrors.push('be at least 8 characters long');
    }
    if (!/[A-Z]/.test(formData.password)) {
      passwordErrors.push('contain at least one uppercase letter');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      passwordErrors.push('contain at least one special character');
    }

    if (passwordErrors.length > 0) {
      alert(`Password must:\n- ${passwordErrors.join('\n- ')}`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (formData.name && formData.email && formData.password) {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            password: formData.password
          })
        });
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          let errMsg = 'Signup failed';
          if (contentType && contentType.includes('application/json')) {
            const err = await res.json();
            errMsg = err.message || errMsg;
          } else {
            errMsg = await res.text();
          }
          throw new Error(errMsg);
        }
        alert('Signup successful! Please sign in.');
        navigate('/signin');
        // Optionally, auto-login or redirect to sign-in page
        // login({ email: formData.email, name: formData.name });
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-orange-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              autoComplete="name"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              autoComplete="email"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              autoComplete="new-password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to='/signin'
              className="text-orange-600 hover:text-orange-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;