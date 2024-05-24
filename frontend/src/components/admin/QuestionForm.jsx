import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import toast from 'react-hot-toast';

const QuestionForm = ({ categories, onSubmit }) => {
  const [formData, setFormData] = useState({ question: '', category: '', options: ['', '', '', ''], correctAnswer: '', image: null });
  const [errors, setErrors] = useState({ question: '', category: '', options: '', correctAnswer: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const editorRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleImageEdit = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const url = canvas.toDataURL();
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'editedImage.png', { type: 'image/png' });
          setFormData({ ...formData, image: file });
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, () => {
        setFormData({ question: '', category: '', options: ['', '', '', ''], correctAnswer: '', image: null });
        setSelectedImage(null);
        toast.success('Pregunta añadida correctamente');
      });
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

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
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
      <div className="form-control mt-6 mb-2">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {selectedImage && (
          <AvatarEditor
            ref={editorRef}
            image={selectedImage}
            width={250}
            height={250}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1}
            rotate={0}
          />
        )}
        {selectedImage && (
          <button type="button" className="btn btn-secondary" onClick={handleImageEdit}>
            Edit Image
          </button>
        )}
      </div>
      <button type="submit" className="btn btn-primary mt-4 w-full">Add Question</button>
    </form>
  );
};

export default QuestionForm;
