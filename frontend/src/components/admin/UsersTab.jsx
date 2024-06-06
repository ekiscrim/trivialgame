import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UserList from './UserList';
import EditUserModal from './EditUserModal';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Error fetching users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [isDirty]);

  const [impersonateUserId, setImpersonateUserId] = useState(null);

  const handleImpersonate = async (userId) => {
    try {
      // Realiza una solicitud al backend para iniciar sesión como el usuario seleccionado
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        // Si la solicitud es exitosa, redirige a la página de inicio o a otra página del usuario impersonado
        // Aquí redirigimos a la página de inicio como ejemplo
        window.location.href = '/';
      } else {
        // Si la solicitud falla, muestra un mensaje de error en la consola
        console.error('Error al iniciar sesión como usuario:', response.statusText);
      }
    } catch (error) {
      // Si hay un error en la solicitud, muestra un mensaje de error en la consola
      console.error('Error al iniciar sesión como usuario:', error);
    }
  };



  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/user/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error deleting user');
        }
        setUsers(users.filter((user) => user._id !== userId));
        setIsDirty(true);
      } catch (error) {
        console.error(error);
        alert('There was an error deleting the user.');
      }
    }
  };

  

  const handleEditUser = (user) => {
    setEditFormData({ ...user });
    setEditModalOpen(true);
    setIsDirty(false);
  };

  const handleEditSubmit = async (formData) => {
    try {
      const response = await fetch(`/api/admin/user/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Error updating user');
      }
      const updatedUser = await response.json();
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      setEditModalOpen(false);
      setIsDirty(true);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCloseModal = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to save them before closing?');
      if (confirmed) {
        handleEditSubmit(editFormData);
      } else {
        setEditModalOpen(false);
        setIsDirty(false);
      }
    } else {
      setEditModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-4">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <UserList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} onImpersonate={handleImpersonate} />
        <EditUserModal
          isOpen={editModalOpen}
          onRequestClose={handleCloseModal}
          initialData={editFormData}
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
};

export default UsersTab;
