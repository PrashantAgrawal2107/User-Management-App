import React from 'react';
import { Link } from 'react-router-dom';
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Import the confirmation modal

const UserTable = ({ users, onDelete, onEdit, searchTerm }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [userIdToDelete, setUserIdToDelete] = React.useState(null);

  // Handle delete button click
  const handleDelete = (userId) => {
    setUserIdToDelete(userId); // Set the user ID to be deleted
    setIsModalOpen(true); // Open the modal
  };

  // Confirm deletion of user
  const confirmDelete = () => {
    onDelete(userIdToDelete); // Confirm deletion
    setIsModalOpen(false); // Close the modal
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.id} className="bg-gray-50 odd:bg-gray-200">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4">
                  <Link to={`/users/${user.id}`} className="text-blue-500">Details</Link>
                  <button
                    className="text-yellow-500 ml-2"
                    onClick={() => onEdit(user)} // Call onEdit with the user details
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 ml-2"
                    onClick={() => handleDelete(user.id)} // Open delete confirmation modal
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 text-center text-gray-500">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal 
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default UserTable;
