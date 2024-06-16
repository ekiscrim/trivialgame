import React from "react";
import { TwitterShareButton, WhatsappShareButton, WhatsappIcon, XIcon } from "react-share";

const ShareComponent = ({ score, roomName, roomUrl, progress }) => {
  // Filtrar filas sin questionId o selectedOption
  const filteredProgress = progress.filter(
    (step) => step.questionId && step.selectedOption
  );

  let shareText = `¡He obtenido *${score} puntos* en la sala *${roomName}*! ¿Puedes superarlo?\n`;

  // Agrupar emojis en filas de cinco para WhatsApp
  for (let i = 0; i < filteredProgress.length; i += 5) {
    const row = filteredProgress
      .slice(i, i + 5)
      .map((step) => (step.isCorrect ? "🟩" : "🟥"))
      .join("");
    shareText += `${row}\n`;
  }

  // Formatear emojis para Twitter en filas de cinco
  const formattedShareTextForTwitter = `¡He obtenido ${score} puntos en la sala ${roomName}! ¿Puedes superarlo?\n\n${filteredProgress
    .map((step, index) => (index % 5 === 4 ? (step.isCorrect ? "🟩\n" : "🟥\n") : (step.isCorrect ? "🟩" : "🟥")))
    .join("")}`;

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4">
          <WhatsappShareButton
            url={roomUrl}
            title={shareText}
            className="flex items-center"
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
            title={formattedShareTextForTwitter}
            className="flex items-center"
            hashtags={['vioquiz']}
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
