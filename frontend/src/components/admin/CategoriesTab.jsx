import { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

const CategoriesTab = () => {
  const { register, handleSubmit: handleCreateSubmit, reset: resetCreateForm, formState: { errors: createErrors } } = useForm();
  const { handleSubmit: handleEditSubmit, reset: resetEditForm, formState: { errors: editErrors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (!response.ok) {
          throw new Error('Error fetching categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Error creating category');
      }
      const category = await response.json();
      setCategories([...categories, category]);
      resetCreateForm(); 
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setEditFormData({ ...category });
    setEditModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error deleting category');
        }
        setCategories(categories.filter(category => category._id !== categoryId));
      } catch (error) {
        console.error(error);
        alert('There was an error deleting the category.');
      }
    }
  };

  const handleEditSubmitModal = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${editCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) {
        throw new Error('Error updating category');
      }
      const responseData = await response.json();
      const updatedCategories = categories.map(category =>
        category._id === responseData._id ? responseData : category
      );
      setCategories(updatedCategories);
      setEditCategory(null);
      setEditFormData(null);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <form onSubmit={handleCreateSubmit(onSubmit)} className="mb-4">
        <div className="form-control">
          <label htmlFor="title" className="label">
            Nombre de la categoría
          </label>
          <input
            type="text"
            id="title"
            name="title"
            {...register('title', { required: true })}
            className={`input input-bordered w-full ${createErrors.title && 'input-error'}`}
          />
          {createErrors.title && <span className="text-xs text-error">El Nombre de la categoría es obligatorio</span>}
        </div>
        <button type="submit" className="btn btn-primary mt-2 w-full">
          Añadir Categoría
        </button>
      </form>
      <ul className="list-disc pl-5">
        {categories.map((category, index) => (
          <li
            key={category._id}
            className={`flex pb-6 items-center justify-between ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
          >
            <span className="text-lg">{category.title}</span>
            <div className="flex">
              <button onClick={() => handleEditCategory(category)} className="btn btn-sm btn-primary mr-2">
                <PencilIcon className="h-5 w-5 text-white" />
              </button>
              <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-sm btn-error">
                <TrashIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        contentLabel="Edit Category"
        className="inline-flex max-h-full animate-scale-in"
        overlayClassName="fixed w-full h-screen top-0 left-0 z-[1000] backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50"
      >
        {editFormData && (
          <form onSubmit={handleEditSubmitModal} className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto overflow-y-auto max-h-full">
            <button type="button" className="btn btn-sm btn-circle" onClick={() => setEditModalOpen(false)}>✕</button>
            <h2 className="text-xl font-semibold mb-4">Editar categoría</h2>
            <div className="form-control">
              <label htmlFor="editTitle" className="label">
                Nombre de la categoría
              </label>
              <input
                type="text"
                id="editTitle"
                name="title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className={`input input-bordered w-full ${editErrors.title && 'input-error'}`}
              />
              {editErrors.title && <span className="text-xs text-error">El nombre de la categoría es obligatorio</span>}
            </div>
            <button type="submit" className="btn btn-primary mt-4 w-full">Actualizar categoría</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default CategoriesTab;
