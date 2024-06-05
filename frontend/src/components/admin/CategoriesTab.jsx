import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/solid'; // Importar el ícono de papelera
import { useForm } from 'react-hook-form';

const CategoriesTab = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);

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
      reset(); 
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };
  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this category and all related questions?');
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

  return (
    <div className="w-full bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="form-control">
          <label htmlFor="title" className="label">
            Category Name
          </label>
          <input
            type="text"
            id="title"
            name="title"
            {...register('title', { required: true })}
            className={`input input-bordered w-full ${errors.title && 'input-error'}`}
          />
          {errors.title && <span className="text-xs text-error">Category name is required</span>}
        </div>
        <button type="submit" className="btn btn-primary mt-2 w-full">
          Add Category
        </button>
      </form>
      <ul className="list-disc pl-5">
        {categories.map((category, index) => (
          <li
            key={category._id}
            className={`flex pb-6 items-center justify-between ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
          >
            <span className="text-lg">{category.title}</span>
            <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-sm btn-error">
              <TrashIcon className="h-5 w-5 text-white" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesTab;
