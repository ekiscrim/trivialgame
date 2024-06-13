import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import toast from 'react-hot-toast';

const NotificationsForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formError, setFormError] = useState('');

  const apiKey = import.meta.env.VITE_TINY_APIKEY;

  useEffect(() => {
    // Fetch users when component mounts
    fetch('/api/admin/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        // Select all users by default
        setSelectedUsers(data.map(user => user._id));
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        toast.error('Error al cargar usuarios.');
      });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar que todos los campos estén completos
    if (!title || !editorContent) {
      setFormError('Por favor, completa todos los campos.');
      return;
    }
  
    let notificationData;
    if (selectedUsers.includes('all')) {
      notificationData = {
        title: title,
        message: editorContent,
        recipient: 'all' // Enviar 'all' al backend si está seleccionado
      };
    } else {
      notificationData = {
        title: title,
        message: editorContent,
        recipient: selectedUsers // Enviar los usuarios seleccionados al backend
      };
    }
  
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
  
      await response.json();
  
      if (typeof onSubmit === 'function') {
        onSubmit();
      }
  
      setTitle('');
      setEditorContent('');
      setSelectedUsers([]);
      setFormError('');
  
      toast.success('Notificación enviada correctamente.');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error al enviar la notificación.');
    }
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
  
    // Verificar si 'all' está seleccionado
    if (selectedOptions.includes('all')) {
      setSelectedUsers(['all']); // Si 'all' está seleccionado, establecer solo 'all'
    } else {
      setSelectedUsers(prevSelectedUsers => {
        // Eliminar 'all' si está presente y agregar solo nuevos valores seleccionados
        const filteredOptions = selectedOptions.filter(option => option !== 'all');
        
        // Si no hay otros usuarios seleccionados además de 'all', desmarcar 'all'
        if (filteredOptions.length === 0) {
          return [];
        } else {
          return [...new Set([...filteredOptions])]; // Usar Set para evitar duplicados
        }
      });
    }
  };
  
  
  const handleSelectAll = () => {
    setSelectedUsers(['all']); // Setear como 'all' para enviar a todos los usuarios
  };
  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Enviar Notificación</h2>
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text">Título:</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="recipient" className="label">
            <span className="label-text">Destinatarios:</span>
          </label>
          <select
              id="recipient"
              value={selectedUsers}
              onChange={handleSelectChange}
              multiple
              className="input input-bordered w-full h-40 overflow-y-scroll"
              style={{ minHeight: '120px' }}
              required
            >
              <option value="all">Todos</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.username}</option>
              ))}
            </select>
            <button type="button" className="btn btn-xs btn-primary mt-2" onClick={handleSelectAll}>
              Seleccionar Todos
            </button>
        </div>
        <div className="form-control">
          <label htmlFor="message" className="label">
            <span className="label-text">Cuerpo del mensaje:</span>
          </label>
          <Editor
            apiKey={apiKey}
            value={editorContent}
            init={{
              height: 500,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
              images_upload_url: "",
              automatic_uploads: true,
              images_reuse_filename: true,
              images_upload_handler: '',
            }}
            onEditorChange={setEditorContent}
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default NotificationsForm;
