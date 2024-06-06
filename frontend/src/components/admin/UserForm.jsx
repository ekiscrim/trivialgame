import { useState } from 'react';
import toast from 'react-hot-toast';

const UserForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    id: initialData._id || null,
    username: initialData.username || '',
    email: initialData.email || '',
    role: initialData.role || 'user',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    role: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', email: '', role: '' };

    if (!formData.username.trim()) {
      newErrors.username = 'Please enter a username';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter an email';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, () => {
        setFormData({ username: '', email: '', role: 'user' });
        toast.success('User added successfully');
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto overflow-y-auto max-h-full">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Role</span>
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input input-bordered w-full"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="text-red-500">{errors.role}</p>}
      </div>
      <button type="submit" className="btn btn-primary mt-4 w-full">
        {formData.id ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
};

export default UserForm;
