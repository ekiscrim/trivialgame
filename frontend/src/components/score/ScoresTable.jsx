import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import ProgressModal from "../../components/score/ProgressModal";
import ProgressComponent from "../question/Progress";
import { HiMiniEye } from "react-icons/hi2";


const fetchScores = async (roomId) => {
  const id = roomId.id || roomId.roomId;
  const response = await fetch(`/api/room/${id}/results`);
  if (!response.ok) {
    throw new Error('Error fetching results');
  }
  return response.json();
};



const ScoresTable = ({ currentUser }) => {
  const id = useParams();
  const { width, height } = useWindowSize();
  const { data: scores, isLoading, isError } = useQuery({
    queryKey: ["results", id],
    queryFn: () => fetchScores(id),
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <p>Error al cargar los resultados.</p>;
  }

  if (!scores || scores.length === 0) {
    return <div className=" w-full"><p className="text-cyan-300 text-center">No hay puntuaciones registradas</p></div>;
  }

  const openModal = (userId) => {
    setSelectedUserId(userId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUserId(null);
  };

  // Encuentra la entrada del usuario actual
  const currentUserScoreEntry = scores.find(scoreEntry => scoreEntry.user._id === currentUser._id || scoreEntry.user._id === currentUser);

  // Verificar si el usuario está en el podio
  const isInPodium = currentUserScoreEntry && scores.indexOf(currentUserScoreEntry) < 3;

  // Podio
  const podium = scores.slice(0, 3);
  // Resto de los usuarios
  const restOfUsers = scores.slice(3);

  

  return (
    <>
      {isInPodium && <Confetti width={width} height={height} wind={0} />}
      <div className="w-full mt-0 flex flex-col items-center animate-scale-in">
        <h2 className="text-2xl font-semibold mb-6 text-white">Ranking de la sala</h2>
        <div className="flex justify-center items-end space-x-8 mb-8">
          {podium.map((scoreEntry, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            const size = isFirst ? 'w-36 h-36' : 'w-24 h-24';
            const borderColor = isFirst ? 'border-yellow-500' : isSecond ? 'border-gray-400' : 'border-yellow-700';
            const textColor = isFirst ? 'text-yellow-500' : isSecond ? 'text-gray-400' : 'text-yellow-700';
            const emojiSize = isFirst ? 'text-5xl' : isSecond ? 'text-4xl' : 'text-3xl';
            const scoreSize = isFirst ? 'text-6xl' : 'text-4xl';
            const usernames = scores.map(score => score.user.username); // Obtenemos todos los nombres de usuario
            const longestUsername = usernames.reduce((a, b) => a.length > b.length ? a : b); // Encontramos el nombre de usuario más largo
            const fontSize = `calc(max(1rem, 1rem - 0.2rem * max(0, min(1, calc((${longestUsername.length} - 10) / 5)))))`;
            return (
              <div key={index} className={`flex flex-col items-center ${isFirst ? 'order-2 podium-item-2-margin' : isSecond ? 'order-1 podium-item-1-margin' : 'order-3 podium-item-3-margin pr-2'}`}>
                <Link to={`/profile/${scoreEntry.user.username}`}>
                  <div className={`rounded-full flex justify-center items-center border-8 ${borderColor}`}>
                    <img src={scoreEntry.user.profileImg || "/avatar-placeholder.png"} alt="Profile" className={`rounded-full  ${size}`} />
                  </div>
                </Link>
                <div className={`mt-2 text-2xl font-bold ${textColor}`} style={{ fontSize: scoreEntry.user.username === longestUsername ? fontSize : '' }}>
                {scoreEntry.user.username.length > 12 ? `${scoreEntry.user.username.substring(0, 12)}...` : scoreEntry.user.username}

    </div>
                <div className={`${scoreSize} font-bold ${textColor}`}>{scoreEntry.score}</div>
                {isFirst && <div className={`${emojiSize}`}>🥇</div>}
                {isSecond && <div className={`${emojiSize}`}>🥈</div>}
                {isThird && <div className={`${emojiSize}`}>🥉</div>}
                <button
                      className="bg-purple-500 text-white mt-6 py-1 px-2 rounded flex items-center"
                      onClick={() => openModal(scoreEntry.user._id)}
                    >
                      <HiMiniEye className="mr-1" />
                      <span>Progreso</span>
                    </button>
              </div>
            );
          })}
        </div>
        
        {scores.length > 3 && (
          <div className="w-full max-w-lg overflow-x-auto">
            <table className="table-auto w-full mb-9">
              <thead>
                <tr>
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2"></th>
                  <th className="px-4 py-2 text-white">Usuario</th>
                  <th className="px-4 py-2 text-white">Puntos</th>
                  <th className="px- py-2 text-white">Progreso</th>
                </tr>
              </thead>
              <tbody>
              {restOfUsers.map((scoreEntry, index) => (
            <tr
              key={index}
              className={(index + 4) % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
              style={currentUser && currentUser === scoreEntry.user._id ? { backgroundColor: 'purple' } : {}}
            >
              <td className="border px-4 py-2 text-center text-white">
                {index + 4}
              </td>
              <td className="border px-4 py-2 text-center">
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                  <Link to={`/profile/${scoreEntry.user.username}`}>
                    <img src={scoreEntry.user.profileImg || "/avatar-placeholder.png"} alt="Profile" />
                  </Link>
                  </div>
                </div>
              </td>
              
                <td className="border px-4 py-2 text-center text-md text-white">
                  <Link to={`/profile/${scoreEntry.user.username}`}>{scoreEntry.user.username}</Link>
                  </td>             
              <td className="border px-4 py-2 text-center text-lg text-white">
                {scoreEntry.score}
              </td>
              <td className="border px-4 py-2 text-center items-center">
                <button
                  className="bg-purple-500 text-white py-1 px-2 rounded"
                  onClick={() => openModal(scoreEntry.user._id)}
                >
                  <HiMiniEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
        )}
      </div>
      <ProgressModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        roomId={id.id}
        userId={selectedUserId}
      />
    </>
  );
};

export default ScoresTable;
