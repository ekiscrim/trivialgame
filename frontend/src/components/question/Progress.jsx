import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const ProgressComponent = ({ roomId, userId, onClose }) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState(null); // Estado para el step seleccionado
  const { data: authUserData } = useQuery({ queryKey: ["authUser"] });
  useEffect(() => {
    const fetchProgress = async () => {
      if (!roomId) {
        console.error("Room ID is undefined");
        setLoading(false);
        return;
      }

      if (!userId) {
        return;
      }

      try {
        const response = await fetch(`/api/participant/${roomId}/${userId}`);
        if (!response.ok) {
          throw new Error('Error fetching progress');
        }
        const data = await response.json();
        
        // Filtrar respuestas sin questionId o selectedOption
        const filteredProgress = data.filter(step => step.questionId && step.selectedOption);

        setProgress(filteredProgress);

      } catch (error) {
        console.error("Error fetching progress", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [roomId, userId]);

  const handleStepClick = (index) => {
    setSelectedStep(selectedStep === index ? null : index); // Alterna entre seleccionar y deseleccionar el step
  };


  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  return (
    <div className="relative  flex flex-col items-center w-full bg-purple-700 rounded-xl shadow-lg p-9 mr-4 ml-4">
      <button
        className="absolute top-2 right-2 text-black btn btn-sm btn-circle"
        onClick={onClose}
      >
        &times;
      </button>
      <h2 className="text-2xl font-semibold mb-3 text-purple-100">Resultados</h2>
      {authUserData._id === userId && (
        <span className="mb-3 text-purple-200">Toca en el nº de pregunta que quieres ver</span>
      )}
      <ul className="steps flex flex-wrap justify-center">
        {progress.map((step, index) => (
          <li
            key={index}
            className={`step flex-2 ${step.isCorrect ? "step-primary" : "step-error"} ${index % 5 === 0 ? "no-line" : ""}`}
            onClick={() => handleStepClick(index)} // Manejar clic en el step
          >
          </li>
        ))}
      </ul>
      {selectedStep !== null && authUserData._id === progress[selectedStep].userId && (
        <div className="mt-6 bg-purple-200 p-4 rounded shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Pregunta {selectedStep}: </h3>
          <p className="bg-white rounded-xl p-2 shadow-xl font-bold">{progress[selectedStep].questionId.question}</p>
          <h4 className="text-lg font-medium mt-4">Tu respuesta:</h4>
          <p className={`step text-white p-4 text-center flex-2 shadow-xl font-bold ${progress[selectedStep].isCorrect ? "badge-success" : "badge-error"}`}>
            {progress[selectedStep].selectedOption}
            </p>
        </div>
      )}
    </div>
  );
};

export default ProgressComponent;
