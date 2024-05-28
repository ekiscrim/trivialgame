import { useQuery } from "@tanstack/react-query";
import { useParams } from 'react-router-dom';
import Question from '../../components/question/Question';

const QuestionPage = () => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!roomData) {
    return <div>No room data available</div>;
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
