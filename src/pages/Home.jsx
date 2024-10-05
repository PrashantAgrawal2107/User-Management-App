import React, { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import { toast } from 'react-toastify';
import CreateUserForm from '../components/CreateUserForm'; // Import the CreateUserForm component
import EditUserForm from '../components/EditUserForm'; // Import the EditUserForm component

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for create user modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit user modal
  const [currentUser, setCurrentUser] = useState(null); // Current user to be edited
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        toast.error('Error fetching users');
        setLoading(false);
      }
    };

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      fetchUsers();
    }
  }, []);

  const addUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Save to local storage
  };

  const updateUser = (updatedUser) => {
    const updatedUsers = users.map(user => user.id === updatedUser.id ? updatedUser : user);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Update local storage
    toast.success('User updated successfully!'); // Notify user of success
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Update local storage
    toast.success('User deleted successfully!'); // Notify user of success
  };

  const handleCreateUserClick = () => {
    setIsCreateModalOpen(true); // Open the create user modal
  };

  const handleEditUserClick = (user) => {
    setCurrentUser(user); // Set the current user for editing
    setIsEditModalOpen(true); // Open the edit user modal
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false); // Close the create user modal
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false); // Close the edit user modal
    setCurrentUser(null); // Clear the current user
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleCreateUserClick}
      >
        Create New User
      </button>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded px-4 py-2 mr-2 w-full" // Added margin right for spacing
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded" // Button for search action
          onClick={() => console.log("Search action triggered!")} // Placeholder for search action
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <UserTable users={users} onDelete={deleteUser} onEdit={handleEditUserClick} searchTerm={searchTerm} />
      )}
      {error && <p className="text-red-500">{error}</p>}

      {/* Modal for creating new user */}
      {isCreateModalOpen && (
        <CreateUserForm closeModal={closeCreateModal} onUserAdd={addUser} />
      )}

      {/* Modal for editing user */}
      {isEditModalOpen && currentUser && (
        <EditUserForm user={currentUser} onUserUpdate={updateUser} closeModal={closeEditModal} />
      )}
    </div>
  );
};

export default Home;
