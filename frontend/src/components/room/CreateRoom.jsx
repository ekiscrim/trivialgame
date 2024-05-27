import { useNavigate } from 'react-router-dom';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { QueryCache, QueryClient, useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../common/LoadingSpinner';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import { HiOutlinePencilAlt } from "react-icons/hi";

const CreateRoom = () => {
  const navigate = useNavigate(); // Obtener el objeto history
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [questionCount, setQuestionCount] = useState(5);
  const [maxUsers, setMaxUsers] = useState(2);
  const [categories, setCategories] = useState([]);
  const [createdRoomId, setCreatedRoomId] = useState(null);

  const {data:authUserData} = useQuery({queryKey: ["authUser"]})

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
      startTime: Date.now(), // Puedes ajustar esto si el tiempo de inicio debe ser diferente
      duration: 86400000 // 24 horas en milisegundos
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
     
      toast.success('Sala creada correctamente');
      //QueryCache.invalidateQueries('listRooms');
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


  const toggleModal = () => setShowModal(!showModal);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  

  if (error) {
    return <div role="alert" className="alert alert-error">{error.message}</div>;
  }

  return (
    <div className='mt-6 mb-6'>
      <Toaster />
      <button className="btn" onClick={toggleModal}>
      <HiOutlinePencilAlt />{"Crear sala"}
      </button>
      <Modal
        isOpen={showModal}
        onRequestClose={toggleModal}
        contentLabel="Crear Sala"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="pt-1 relative">
        <button className='btn btn-sm btn-circle absolute top-0 right-0 ' onClick={toggleModal}>✕</button>
        <h2 className="text-xl font-semibold mb-4">Crear Sala</h2>
        <form onSubmit={handleSubmit} className="md:grid-cols-1 gap-4 mt-4">
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
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
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
        </div>
      </Modal>

    </div>
  );
};

export default CreateRoom;
