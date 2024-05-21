import { useEffect, useState } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/solid'; // Importar los íconos de papelera y lápiz
import Modal from 'react-modal';

const QuestionTab = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({ question: '', category: '', options: ['', '', '', ''], correctAnswer: '' });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({ question: '', category: '', options: '', correctAnswer: '' });
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
  }, [isDirty]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('/api/admin/question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Error creating question');
        }
        const data = await response.json();
        setQuestions([...questions, data]);
        setFormData({ question: '', category: '', options: ['', '', '', ''], correctAnswer: '' });
        setIsDirty(false);
      } catch (error) {
        console.error('Error creating question:', error);
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.question.trim()) {
      newErrors.question = 'Please enter a question';
      valid = false;
    } else {
      newErrors.question = '';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
      valid = false;
    } else {
      newErrors.category = '';
    }

    if (formData.options.some(option => !option.trim())) {
      newErrors.options = 'Please enter all options';
      valid = false;
    } else {
      newErrors.options = '';
    }

    if (!formData.correctAnswer) {
      newErrors.correctAnswer = 'Please select the correct answer';
      valid = false;
    } else {
      newErrors.correctAnswer = '';
    }

    setErrors(newErrors);
    return valid;
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

  const handleEditChange = e => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/question/${editFormData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
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
    <div className="min-h-screen w-screen mt-0 flex justify-center items-center">
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        <form onSubmit={onSubmit} className="mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Question</span>
            </label>
            <input type="text" name="question" value={formData.question} onChange={onChange} className="input input-bordered w-full" />
            {errors.question && <p className="text-red-500">{errors.question}</p>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select name="category" value={formData.category} onChange={onChange} className="input input-bordered w-full">
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.title}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500">{errors.category}</p>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            {formData.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={e => {
                  const newOptions = [...formData.options];
                  newOptions[index] = e.target.value;
                  setFormData({ ...formData, options: newOptions });
                  setIsDirty(true);
                }}
                className="input input-bordered w-full"
              />
            ))}
            {errors.options && <p className="text-red-500">{errors.options}</p>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Correct Answer</span>
            </label>
            <select name="correctAnswer" value={formData.correctAnswer} onChange={onChange} className="input input-bordered w-full">
              <option value="">Select the correct answer</option>
              {formData.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {errors.correctAnswer && <p className="text-red-500">{errors.correctAnswer}</p>}
          </div>
          <button type="submit" className="btn btn-primary mt-4 w-full">Add Question</button>
        </form>
        <ul className="list-disc pl-5 w-full">
          {questions.map((question, index) => (
            <li key={question._id} className={`flex flex-col p-4 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <div className="flex justify-between">
                <span className='text-lg'>{question.question}</span>
                <div>
                  <button onClick={() => handleEditQuestion(question)} className="btn btn-sm btn-primary mr-2">
                    <PencilIcon className="h-5 w-5 text-white" />
                  </button>
                  <button onClick={() => handleDeleteQuestion(question._id)} className="btn btn-sm btn-error">
                    <TrashIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
              <div>
                <ul className="list-inside">
                  {question.options.map((option, idx) => (
                    <li key={idx} className={`text-sm ${option === question.correctAnswer ? 'text-green-500' : ''}`}>
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <Modal
          isOpen={editModalOpen}
          onRequestClose={handleCloseModal}
          shouldCloseOnOverlayClick={true}
          contentLabel="Edit Question"
          className="inline-flex"
          overlayClassName="fixed w-full h-screen top-0 left-0 z-[1000] backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50"
        >
          {editFormData && (
            <form onSubmit={handleEditSubmit} className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto">
              <button className='btn btn-sm btn-circle' onClick={handleCloseModal}>✕</button>
              <h2 className="text-xl font-semibold mb-4">Edit Question</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Question</span>
                </label>
                <input type="text" name="question" value={editFormData.question} onChange={handleEditChange} className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select name="category" value={editFormData.category} onChange={handleEditChange} className="input input-bordered w-full">
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Options</span>
                </label>
                {editFormData.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={e => {
                      const newOptions = [...editFormData.options];
                      newOptions[index] = e.target.value;
                      setEditFormData({ ...editFormData, options: newOptions });
                      setIsDirty(true);
                    }}
                    className="input input-bordered w-full"
                  />
                ))}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Correct Answer</span>
                </label>
                <select name="correctAnswer" value={editFormData.correctAnswer} onChange={handleEditChange} className="input input-bordered w-full">
                  <option value="">Select the correct answer</option>
                  {editFormData.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary mt-4 w-full">Update Question</button>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default QuestionTab;
