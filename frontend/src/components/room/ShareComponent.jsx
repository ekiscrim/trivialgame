import React, { useRef, useEffect } from "react";
import { TwitterShareButton, WhatsappShareButton, WhatsappIcon, XIcon } from "react-share";

const ShareComponent = ({ score, roomName, roomUrl, progress }) => {
  const canvasRef = useRef(null);

  // Filtrar filas sin questionId o selectedOption
  const filteredProgress = progress.filter(
    (step) => step.questionId && step.selectedOption
  );

  // Formatear emojis para la imagen
  const formattedEmojis = filteredProgress.map((step) => (step.isCorrect ? "🟩" : "🟥")).join("");

  useEffect(() => {
    // Función para generar la imagen en el canvas
    const generateImage = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Configurar el estilo y el texto para la imagen
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "20px Arial";
      ctx.fillStyle = "#000000";
      ctx.fillText(`Score: ${score}`, 20, 30);
      ctx.fillText(`Room Name: ${roomName}`, 20, 60);
      ctx.fillText("Progress:", 20, 90);

      // Dibujar emojis de progreso
      let xPos = 120;
      ctx.font = "30px Arial";
      for (let i = 0; i < formattedEmojis.length; i++) {
        ctx.fillText(formattedEmojis[i], xPos, 120);
        xPos += 30;
      }

      // Obtener la URL de la imagen generada
      const imageURI = canvas.toDataURL("image/png");
      return imageURI;
    };

    // Generar la imagen al cargar el componente
    generateImage();
  }, [score, roomName, formattedEmojis]);

  // Función para compartir en WhatsApp
  const shareOnWhatsApp = () => {
    const imageURI = canvasRef.current.toDataURL("image/png");
  
    // Construir el enlace de WhatsApp
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent("¡Mira el podio!")}&media=${encodeURIComponent(imageURI)}`;
  
    // Abrir WhatsApp con el enlace preparado
    window.open(whatsappLink, "_blank");
  };
  // Función para compartir en Twitter
  const shareOnTwitter = () => {
    const imageURI = canvasRef.current.toDataURL("image/png");
  
    // Construir el enlace de Twitter
    const twitterLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageURI)}`;
  
    // Abrir Twitter con el enlace preparado
    window.open(twitterLink, "_blank");
  };

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <canvas ref={canvasRef} width={400} height={150} style={{ display: "none" }} />
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4">
          <WhatsappShareButton
            url={roomUrl}
            title={`¡He obtenido *${score} puntos* en la sala *${roomName}*! ¿Puedes superarlo?\n${filteredProgress
              .reduce((acc, step, index) => {
                return acc + (index > 0 && index % 5 === 0 ? "\n" : "") + (step.isCorrect ? "🟩" : "🟥");
              }, "")}`}
            separator=""
            className="flex items-center"
            onClick={shareOnWhatsApp}
          >
            <>
              <WhatsappIcon size={32} round={true} />
              <span className="text-green-100 ml-2">Compartir en WhatsApp</span>
            </>
          </WhatsappShareButton>
        </div>
        <div className="flex items-center">
          <TwitterShareButton
            url={roomUrl}
            title={`¡He obtenido ${score} puntos en la sala ${roomName}! ¿Puedes superarlo?\n\n${filteredProgress
              .map((step, index) => (index % 5 === 4 ? (step.isCorrect ? "🟩\n" : "🟥\n") : (step.isCorrect ? "🟩" : "🟥")))
              .join("")}`}
            hashtags={['vioquiz']}
            separator=""
            className="flex items-center"
            onClick={shareOnTwitter}
          >
            <>
              <XIcon size={32} round={true} />
              <span className="text-green-100 ml-2">Compartir en X</span>
            </>
          </TwitterShareButton>
        </div>
      </div>
    </div>
  );
};

export default ShareComponent;
