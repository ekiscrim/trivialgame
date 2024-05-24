import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/solid'; // Importar el ícono de papelera

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ title: '' });

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

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Error creating category');
      }
      const data = await response.json();
      setCategories([...categories, data]);
      setFormData({ title: '' });
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
    <div className="min-h-screen min-w-screen mt-0 flex flex-row  bg-gray-100">
      <form onSubmit={onSubmit} className="mb-4 w-full">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Category Name</span>
          </label>
          <input type="text" name="title" value={formData.title} onChange={onChange} className="input input-bordered w-full" />
        </div>
        <button type="submit" className="btn btn-primary mt-2 w-full">Add Category</button>
      </form>
      <ul className="list-disc pl-5 w-full">
        {categories.map((category,index) => (
          <li key={category._id} className={`flex pb-6 items-center justify-between ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
            <span className='text-lg'>{category.title}</span>
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
