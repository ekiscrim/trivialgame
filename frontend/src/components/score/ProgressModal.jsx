import Modal from 'react-modal';
import ProgressComponent from "../question/Progress";


const ProgressModal = ({ isOpen, onRequestClose, roomId, userId }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="inline-flex max-h-full animate-scale-in"
      overlayClassName="fixed w-full h-screen top-0 left-0 z-[1000] backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50"
    >
      <ProgressComponent roomId={roomId} userId={userId} />
    </Modal>
  );
};

export default ProgressModal;
