import { WhatsappIcon, WhatsappShareButton } from "react-share";

const ShareComponent = ({ score, roomUrl, progress }) => {
    let shareText = `¡He obtenido ${score} puntos! ¿Puedes superarlo?\n`;
  
    for (let i = 0; i < progress.length; i += 5) {
      const row = progress.slice(i, i + 5).map(step => (step.isCorrect ? '🟩' : '🟥')).join('');
      shareText += row + '\n';
    }
  
    return (
      <div className="w-full flex justify-center items-center mt-10">
        <div className="flex items-center">
          <WhatsappShareButton url={roomUrl} title={shareText}>
            <div className="flex items-center">
              <WhatsappIcon size={32} round={true} />
              <span className="text-green-100 ml-2">Compartir en WhatsApp</span>
            </div>
          </WhatsappShareButton>
        </div>
      </div>
    );
  };
  
  export default ShareComponent;
  