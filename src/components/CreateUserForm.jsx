import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CreateUserForm = ({ closeModal, onUserAdd, existingUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    website: '',
    address: { street: '', city: '' },
    company: { name: '' },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-fill username when creating a new user
  useEffect(() => {
    if (existingUser) {
      setFormData({ ...existingUser });
    } else {
      const username = `USER-${formData.name.split(' ').join('-')}`; // Format as USER-name
      setFormData((prev) => ({ ...prev, username }));
    }
  }, [existingUser, formData.name]);

  // Input validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.address.street || !formData.address.city) {
      newErrors.address = 'Address fields are required';
    }
    if (formData.company.name && formData.company.name.length < 3) {
      newErrors.company = 'Company name must be at least 3 characters';
    }
    if (formData.website && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address')) {
      const field = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [field]: value },
      }));
    } else if (name.includes('company')) {
      const field = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        company: { ...prevData.company, [field]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newUser = {
        ...formData,
        id: existingUser ? existingUser.id : Math.floor(Math.random() * 1000), // Simulate an ID for the new user
      };

      // Save to local storage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (!existingUser) {
        users.push(newUser);
      } else {
        const index = users.findIndex((user) => user.id === existingUser.id);
        users[index] = newUser; // Update existing user
      }
      localStorage.setItem('users', JSON.stringify(users));

      // Add or update the user in the list
      onUserAdd(newUser); // Update the parent component with the new user

      toast.success(existingUser ? 'User updated successfully' : 'User created successfully');
    } catch (error) {
      toast.error('Failed to create/update user');
    } finally {
      setLoading(false);
    }
    closeModal(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{existingUser ? 'Update User' : 'Create New User'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`border rounded p-2 w-full ${errors.name ? 'border-red-500' : ''}`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`border rounded p-2 w-full ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`border rounded p-2 w-full ${errors.phone ? 'border-red-500' : ''}`}
              required
            />
            {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              readOnly // Non-editable field
              className="border rounded p-2 w-full bg-gray-200"
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Street:</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className={`border rounded p-2 w-full ${errors.address ? 'border-red-500' : ''}`}
              required
            />
            {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">City:</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              className={`border rounded p-2 w-full ${errors.address ? 'border-red-500' : ''}`}
              required
            />
            {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Company Name:</label>
            <input
              type="text"
              name="company.name"
              value={formData.company.name}
              onChange={handleChange}
              className={`border rounded p-2 w-full ${errors.company ? 'border-red-500' : ''}`}
            />
            {errors.company && <p className="text-red-500 text-xs italic">{errors.company}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Website:</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`border rounded p-2 w-full ${errors.website ? 'border-red-500' : ''}`}
            />
            {errors.website && <p className="text-red-500 text-xs italic">{errors.website}</p>}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
