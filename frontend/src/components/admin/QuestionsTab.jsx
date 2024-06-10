import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import EditQuestionModal from './EditQuestionModal';

const QuestionTab = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = questions.filter((question) => {
    const matchesCategory = selectedCategory ? question.category === selectedCategory : true;
    const matchesSearchTerm = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!selectedCategory && !searchTerm) {
          setQuestions([]); // Clear questions if no category or search term is provided
          return;
        }
        if (searchTerm === '') {
          setQuestions([])
          return;
        }

        let url = `/api/admin/questions`;
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }
        if (searchTerm) {
          url += selectedCategory ? `&search=${searchTerm}` : `?search=${searchTerm}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error fetching questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
      fetchQuestions();
  },[searchTerm, selectedCategory, isDirty]);


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
  }, [isDirty]);

  const handleCategoryChange = async (categoryId) => {
    try {
      setSelectedCategory(categoryId);
      let response;
      if (categoryId === "") {
        response = await fetch(`/api/admin/questions`);
      } else {
        response = await fetch(`/api/admin/questions?category=${categoryId}`);
      }
      if (!response.ok) {
        throw new Error('Error fetching questions by category');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions by category:', error);
    }
  };

  const handleAddQuestion = async (formData, resetForm) => {
    try {
      const formDataWithImage = new FormData();
      formDataWithImage.append('question', formData.question);
      formDataWithImage.append('category', formData.category);
      formDataWithImage.append('correctAnswer', formData.correctAnswer);
      if (formData.image) {
        formDataWithImage.append('image', formData.image);
      }
      formData.options.forEach(option => formDataWithImage.append('options', option));

      const response = await fetch('/api/admin/question', {
        method: 'POST',
        body: formDataWithImage,
      });
      if (!response.ok) {
        throw new Error('Error creating question');
      }
      const data = await response.json();
      setQuestions([...questions, data]);
      resetForm();
      setIsDirty(false);
    } catch (error) {
      toast.error('Error adding the question');
      console.error('Error creating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirmed = window.confirm('Are you sure you want to delete this question?');
    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/question/${questionId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error deleting question');
        }
        setQuestions(questions.filter(question => question._id !== questionId));
      } catch (error) {
        console.error(error);
        alert('There was an error deleting the question.');
      }
    }
  };

  const handleEditQuestion = (question) => {
    setEditFormData({ ...question });
    setEditModalOpen(true);
    setIsDirty(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithImage = new FormData();
      formDataWithImage.append('_id', editFormData._id);
      formDataWithImage.append('question', editFormData.question);
      formDataWithImage.append('category', editFormData.category);
      formDataWithImage.append('correctAnswer', editFormData.correctAnswer);
      if (editFormData.image) {
        formDataWithImage.append('image', editFormData.image);
      }
      editFormData.options.forEach(option => formDataWithImage.append('options', option));

      const response = await fetch(`/api/admin/question/${editFormData._id}`, {
        method: 'PUT',
        body: formDataWithImage,
      });
      if (!response.ok) {
        throw new Error('Error updating question');
      }
      const updatedQuestion = await response.json();
      setQuestions(prevQuestions => prevQuestions.map(q => (q._id === updatedQuestion._id ? updatedQuestion : q)));
      setEditModalOpen(false);
      setIsDirty(false);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleCloseModal = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to save them before closing?');
      if (confirmed) {
        handleEditSubmit(new Event('submit'));
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
        <h2 className="text-xl font-semibold mb-4">Preguntas</h2>
        <QuestionForm categories={categories} onSubmit={handleAddQuestion} />
        <div className="mb-4">
          <label htmlFor="category" className="block font-medium text-gray-700">Filtrar por categoría:</label>
          <select
            id="category"
            name="category"
            className="input input-bordered w-full"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(category => {
              const categoryQuestions = questions.filter(question => question.category === category._id);
              return (
                <option key={category._id} value={category._id}>{category.title} ({categoryQuestions.length})</option>
              );
            })}
          </select>
        </div>
        <div className="mb-12">
          <label htmlFor="search" className="block font-medium text-gray-700">Buscar preguntas:</label>
          <input
            id="search"
            name="search"
            type="text"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar pregunta"
          />
        </div>

        <QuestionList questions={filteredQuestions} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
        <EditQuestionModal
          isOpen={editModalOpen}
          onRequestClose={handleCloseModal}
          categories={categories}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          onSubmit={handleEditSubmit}
          isDirty={isDirty}
        />
      </div>
    </div>
  );
};

export default QuestionTab;
