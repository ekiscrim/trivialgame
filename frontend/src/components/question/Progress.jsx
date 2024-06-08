import { useState, useEffect } from "react";

const ProgressComponent = ({ roomId, userId }) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!roomId) {
        console.error("Room ID is undefined");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch(`/api/participant/${roomId}/${userId}`);
        if (!response.ok) {
          throw new Error('Error fetching progress');
        }
        const data = await response.json();
        setProgress(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching progress", error);
        setLoading(false);
      }
    };
  
    fetchProgress();
  }, [roomId, userId]);
  

  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full bg-black p-9">
      <h2 className="text-2xl font-semibold mb-6 text-purple-100">Resultados</h2>
      <ul className="steps flex flex-wrap justify-center ">
        {progress.map((step, index) => (
          <li
            key={index}
            className={`step flex-2 ${step.isCorrect ? "step-primary" : "step-error"} ${index % 5 === 0 ? "no-line" : ""}`}
          >
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressComponent;
