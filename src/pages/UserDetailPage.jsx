import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Check local storage for users
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if the user is in local storage
      const foundUser = users.find(user => user.id === Number(id));

      if (foundUser) {
        setUser(foundUser);
        setLoading(false);
      } else {
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          const data = await response.json();
          setUser(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p className="text-center text-lg font-semibold text-blue-600">Loading...</p>;

  if (error) return <p className="text-center text-lg font-semibold text-red-600">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full">
        {/* User Profile Image */}
        <div className="p-6 border-b">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=128`}
            alt={user.name}
            className="w-32 h-32 rounded-full mx-auto shadow-lg"
          />
        </div>
        
        {/* User Details */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-4">{user.name}</h2>

          <div className="grid grid-cols-1 gap-4 text-gray-700">
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {user.phone}
            </div>
            <div>
              <span className="font-medium">Website:</span>
              <a
                href={`http://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {user.website}
              </a>
            </div>
            <div>
              <span className="font-medium">Address:</span> {user.address.street}, {user.address.city}
            </div>
            <div>
              <span className="font-medium">Company:</span> {user.company?.name}
            </div>
          </div>
        </div>

        {/* Footer with Extra Info */}
        <div className="bg-gray-50 p-4 rounded-b-lg text-center">
          <p className="text-sm text-gray-500">User ID: {user.id}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;

