import { useQuery } from "@tanstack/react-query";
import { useParams } from 'react-router-dom';
import Question from '../../components/question/Question';
import { useEffect } from "react";

const QuestionPage = () => {
  
  useEffect(() => {
    const handleBackNavigation = (event) => {
      event.preventDefault();
      window.history.forward(); // Avanzar una página para mantener al usuario en la página actual
    };

    window.history.pushState(null, null, window.location.pathname); // Agregar una nueva entrada al historial
    window.addEventListener('popstate', handleBackNavigation);

    return () => {
      window.removeEventListener('popstate', handleBackNavigation);
    };
  }, []);

  const {data:userId} = useQuery({queryKey: ["authUser"]})
  const { roomId, categoryId } = useParams();
  const { data: roomData, isLoading, error } = useQuery({
    queryKey: ["roomData", roomId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { data: userScoreData, isLoading: isLoadingScore } = useQuery({
    queryKey: ["userScoreData", roomId, userId._id],
    queryFn: async () => {
      if (!roomId || !userId._id) throw new Error('Room ID or User ID is undefined');
      const res = await fetch(`/api/scores/${roomId}/${userId._id}`);
      if (!res.ok) throw new Error('Error fetching user score data');
      return res.json();
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isLoadingScore) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!roomData) {
    return <div>No room data available</div>;
  }

  if (roomData.room.roomType === 'super' && userScoreData.hasScore) {
    window.location.href = '/';
  }

  // Aquí asumimos que roomData.room.categories es un array de IDs de categorías
  const categoryIds = roomData.room.categories;
  const questionCount = roomData.room.questionCount;



  return (
    <div className="animate-scale-in">
      <Question userId={userId._id} roomId={roomId} categoryIds={categoryIds} questionCount={questionCount} />
    </div>
  );
};

export default QuestionPage;
