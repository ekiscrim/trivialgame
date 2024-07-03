import { useNavigate } from 'react-router-dom';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../common/LoadingSpinner';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import { HiOutlinePencilAlt } from "react-icons/hi";

import { generateAdjectives, generateNouns } from "../../utils/roomNames";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [categories, setCategories] = useState([]);
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [isSuperRoom, setIsSuperRoom] = useState(false);

  const { data: authUserData } = useQuery({ queryKey: ["authUser"] });
  const isAdmin = authUserData && authUserData.role === 'admin';

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

  const { data: roomCounts, refetch: refetchRoomCounts } = useQuery({
    queryKey: ['roomCounts', authUserData?._id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rooms/counts/${authUserData?._id}`);
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Algo fue mal');
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!authUserData,
  });

  const adjetivos = generateAdjectives();
  const sustantivos = generateNouns();

  const generarNombreSala = () => {
    const genero = Math.random() < 0.5 ? 'male' : 'female';
    const adjetivo = adjetivos[genero][Math.floor(Math.random() * adjetivos[genero].length)];
    const sustantivo = sustantivos[Math.floor(Math.random() * sustantivos.length)];
    const adjetivoConcordante = ajustarGenero(adjetivo, sustantivo, genero);
    return `${adjetivoConcordante} ${sustantivo}`;
  };

  const ajustarGenero = (adjetivo, sustantivo, genero) => {
    if (genero === 'male') {
      if (adjetivo.endsWith('a') && !esExcepcionMasculina(sustantivo)) {
        return adjetivo.slice(0, -1) + 'o';
      }
    } else if (genero === 'female') {
      if (adjetivo.endsWith('o') && !esExcepcionFemenina(sustantivo)) {
        return adjetivo.slice(0, -1) + 'a';
      }
    }
    return adjetivo;
  };

  const esExcepcionFemenina = (sustantivo) => {
    const excepcionesFemeninas = [
      "cuestión", "asunto", "misterio", "problema",
      "competencia", "prueba", "experiencia", "circunstancia"
    ];
    return excepcionesFemeninas.includes(sustantivo);
  };

  const esExcepcionMasculina = (sustantivo) => {
    const excepcionesMasculinas = [
      "concurso", "juego", "reto", "desafío",
      "proyecto", "evento", "estudio", "análisis"
    ];
    return excepcionesMasculinas.includes(sustantivo);
  };

  const handleSuperRoomChange = (e) => {
    setIsSuperRoom(e.target.checked);
  };

  const handleGenerateRoomName = () => {
    setRoomName(generarNombreSala());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (categories.length === 0) {
      toast.error('Por favor selecciona al menos una categoría');
      return;
    }
    if (roomName.length === 0) {
      toast.error('El nombre de la sala es obligatorio');
      return;
    }
    const endpoint = isSuperRoom ? '/api/rooms/createSuper' : '/api/rooms/createNormal';
    const formData = {
      roomName,
      questionCount,
      categories,
      creatorId: authUserData?._id,
      users: authUserData._id,
      startTime: Date.now(),
      duration: 86400000,
      roomType: isSuperRoom ? 'super' : 'normal'
    };

    try {
      const res = await fetch(endpoint, {
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
      refetchRoomCounts(); // Refetch room counts after creating a new room
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (createdRoomId) {
      navigate(`/rooms/${createdRoomId}`);
    }
  }, [createdRoomId, navigate]);

  useEffect(() => {
    if (listCategoriesQuery && listCategoriesQuery.length > 0) {
      setCategories([listCategoriesQuery[0]]);
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
        className="modal-content animate-scale-in"
        overlayClassName="modal-overlay"
        style={{
          overlay: {
            zIndex: 50, // Añadir zIndex para asegurar que el modal esté por encima del navbar
          },
        }}
      >
        <div className="pt-1 relative">
          <button className='btn btn-sm btn-circle absolute top-0 right-0 ' onClick={toggleModal}>✕</button>
          <h2 className="text-xl font-semibold mb-4">Crear Sala</h2>
  
          {roomCounts && !isAdmin && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-md text-gray-600">Salas creadas hoy: <span className="font-bold">{roomCounts.normal}/3</span></p>
              <p className="text-md text-gray-600">Salas bomba creadas hoy: <span className="font-bold">{roomCounts.super}/1</span></p>
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="md:grid-cols-1 gap-4 mt-4">
            <div className="form-control mb-2">
              <label htmlFor="roomName">Nombre de la sala</label>
              <div className="flex">
                <input
                  name="roomName"
                  maxLength={25}
                  type="text"
                  placeholder="Nombre de la sala"
                  className="input input-bordered w-full"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <button type="button" className="btn btn-secondary ml-2" onClick={handleGenerateRoomName}>Generar</button>
              </div>
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
            <div className="form-control mt-2 mb-2">
              <label htmlFor="isSuperRoom" className="flex items-center">
                <input
                  name="isSuperRoom"
                  type="checkbox"
                  className="mr-2 checkbox checkbox-secondary mt-2"
                  checked={isSuperRoom}
                  onChange={handleSuperRoomChange}
                />
                <span className="mr-2 mt-2">Sala Bomba</span>
              </label>
            </div>
            <div className="form-control">
              <MultiSelectDropdown
                formFieldName="categories"
                options={listCategoriesQuery}
                selectedOptions={categories}
                onChange={(selectedCategories) => setCategories(selectedCategories)}
              />
            </div>
            <div className="form-control">
              <input type="submit" value="CREAR" className="btn btn-primary w-full" />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
  
  
  
  
};

export default CreateRoom;
