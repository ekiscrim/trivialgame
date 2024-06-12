import React from "react";
import { WhatsappIcon, WhatsappShareButton } from "react-share";

const ShareComponent = ({ score, roomName, roomUrl, progress }) => {
  // Filtrar filas sin questionId o selectedOption
  const filteredProgress = progress.filter(
    (step) => step.questionId && step.selectedOption
  );

  let shareText = `¡He obtenido *${score} puntos* en la sala *${roomName}*! ¿Puedes superarlo?\n`;

  for (let i = 0; i < filteredProgress.length; i += 5) {
    const row = filteredProgress
      .slice(i, i + 5)
      .map((step) => (step.isCorrect ? "🟩" : "🟥"))
      .join("");
    shareText += `\`\`\`${row}\`\`\`\n`;
  }

  // URL de la imagen generada dinámicamente

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <div className="flex items-center">
        <WhatsappShareButton
          url={roomUrl}
          title={shareText}
        >
          <div className="flex items-center">
            <WhatsappIcon size={32} round={true} />
            <span className="text-green-100 ml-2">
              Compartir en WhatsApp
            </span>
          </div>
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default ShareComponent;
