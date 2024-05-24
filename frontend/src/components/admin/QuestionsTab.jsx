import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import EditQuestionModal from './EditQuestionModal';

const QuestionTab = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/admin/questions');
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
  }, [questions, isDirty]);

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
      toast.error('Error al añadir la pregunta');
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
      setQuestions(questions.map(q => (q._id === updatedQuestion._id ? updatedQuestion : q)));
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
    <div className="min-h-screen w-screen mt-0 flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        <QuestionForm categories={categories} onSubmit={handleAddQuestion} />
        <QuestionList questions={questions} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
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
