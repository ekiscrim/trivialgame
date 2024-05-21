import { useNavigate } from 'react-router-dom';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../common/LoadingSpinner';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const CreateRoom = () => {
  const navigate = useNavigate(); // Obtener el objeto history
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [questionCount, setQuestionCount] = useState(3);
  const [maxUsers, setMaxUsers] = useState(2);
  const [categories, setCategories] = useState([]);
  const [createdRoomId, setCreatedRoomId] = useState(null);

  const {data:authUserData} = useQuery({queryKey: ["authUser"]})
  const toggleForm = () => {
    setShowForm(prevShowForm => !prevShowForm);
  };

  const { data: listCategoriesQuery, isLoading, error } = useQuery({
    queryKey: ['listCategories'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/category/list');
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Algo fue mal');
        
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      roomName,
      questionCount,
      maxUsers,
      categories,
      creatorId: authUserData._id,
    };


    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Algo fue mal');
      
      const roomId = data._id;
      setCreatedRoomId(roomId);
     
      //queryClient.invalidateQueries('listRooms');
      toast.success('Sala creada correctamente');
    } catch (error) {
      toast.error('Error al crear la sala');
    }
  };

  useEffect(() => {

    if (createdRoomId) {
      navigate(`/rooms/${createdRoomId}`);
    }
  }, [createdRoomId, navigate]);

  useEffect(() => {
    if (listCategoriesQuery && listCategoriesQuery.length > 0) {
      setCategories([listCategoriesQuery[0]]); // Set the first category as default
    }
  }, [listCategoriesQuery]);


  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  

  if (error) {
    return (
      <div className="mt-6 ml-4 grid sm:grid-flow-row md:grid-flow-row md:grid-cols-2 gap-y-5 content-stretch">
        <div role="alert" className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <button className="btn" onClick={toggleForm}>
        {"Crear sala"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="form-control">
            <label htmlFor="roomName">Nombre de la sala</label>
            <input
              name="roomName"
              type="text"
              placeholder="Nombre de la sala"
              className="input input-bordered w-full"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div className="form-control">
          <label htmlFor="questionCount">Número de preguntas</label>
            <select
              name="questionCount"
              className="select select-bordered w-full"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            >
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="maxUser">Participantes máximos</label>
            <select
              name="maxUsers"
              className="select select-bordered w-full"
              value={maxUsers}
              onChange={(e) => setMaxUsers(e.target.value)}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="form-control">
            <MultiSelectDropdown
                formFieldName="categories"
                options={listCategoriesQuery}
                selectedOptions={categories}
                onChange={(selectedCategories) => setCategories(selectedCategories)}
            />
          </div>

          <div className="form-control md:col-span-2">
            <input type="submit" value="CREAR" className="btn btn-primary w-full" />
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateRoom;
