import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import toast from 'react-hot-toast';

const QuestionForm = ({ categories, onSubmit }) => {
  const [formData, setFormData] = useState({ question: '', category: '', options: ['', '', '', ''], correctAnswer: '', image: null });
  const [errors, setErrors] = useState({ question: '', category: '', options: '', correctAnswer: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const editorRef = useRef(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  // Función para generar respuestas incorrectas utilizando IA
  const generateIncorrectAnswers = async (question) => {
    try {
      const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
      const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: `Genera una lista numerada del 1 al 4 con respuestas. Una de estas respuestas es la correcta, las otras tres serán incorrectas para la siguiente pregunta: ${question}`,
          options: {
            num_return_sequences: 1, // Generar 1 conjunto de respuestas
            do_sample: true, // Muestrear respuestas
          },
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generando respuestas:', error);
      return [];
    }
  };

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

  const handleGenerateAnswers = async () => {
    if (formData.question.trim() !== '') {
      const incorrect = await generateIncorrectAnswers(formData.question);
      setIncorrectAnswers(incorrect);

      // Extraer las respuestas incorrectas del texto generado
      const incorrectResponses = incorrect[0]?.generated_text.match(/\d+\.\s+(.+)/g)?.map(match => match.replace(/^\d+\.\s+/, ''));
      if (incorrectResponses && incorrectResponses.length >= 4) {
        // Insertar respuestas incorrectas en los campos de respuesta
        const newOptions = [...formData.options];
        incorrectResponses.forEach((answer, index) => {
          if (index < newOptions.length) {
            newOptions[index] = answer;
          }
        });
        setFormData({ ...formData, options: newOptions });
      } else {
        toast.error('No se pudieron generar suficientes respuestas incorrectas.');
      }
    } else {
      toast.error('Por favor, escribe una pregunta primero.');
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
      newErrors.question = 'Por favor, escribe una pregunta';
      valid = false;
    } else {
      newErrors.question = '';
    }

    if (!formData.category) {
      newErrors.category = 'Por favor, selecciona una categoría';
      valid = false;
    } else {
      newErrors.category = '';
    }

    if (formData.options.some(option => !option.trim())) {
      newErrors.options = 'Por favor, escribe todas las opciones';
      valid = false;
    } else {
      newErrors.options = '';
    }

    if (!formData.correctAnswer) {
      newErrors.correctAnswer = 'Por favor, selecciona la opción correcta';
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
          <span className="label-text">Pregunta</span>
        </label>
        <input type="text" name="question" value={formData.question} onChange={onChange} className="input input-bordered w-full" />
        {errors.question && <p className="text-red-500">{errors.question}</p>}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Categoría</span>
        </label>
        <select name="category" value={formData.category} onChange={onChange} className="input input-bordered w-full">
          <option value="">Selecciona una categoría</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.title}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500">{errors.category}</p>}
      </div>
      <div className="form-control">
        <label className="label">
          <button
            type="button"
            className='btn btn-neutral mt-4 w-full'
            onClick={handleGenerateAnswers}>
          Generar opciones de respuestas por IA
          </button>
        </label>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Opciones de respuesta</span>
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
      {incorrectAnswers.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-2">Respuestas incorrectas generadas:</h3>
          <ul className="list-none pl-5 space-y-2">
            {incorrectAnswers.map((answer, index) => (
              <li key={index} className="text-gray-700">{answer.generated_text}</li>
            ))}
          </ul>
        </div>
        )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Respuesta correcta</span>
        </label>
        <select name="correctAnswer" value={formData.correctAnswer} onChange={onChange} className="input input-bordered w-full">
          <option value="">Selecciona la respuesta correcta</option>
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
            border={10}
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
      <button type="submit" className="btn btn-primary mt-4 w-full">Añadir pregunta</button>
    </form>
  );
};

export default QuestionForm;
