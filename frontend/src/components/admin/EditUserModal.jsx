import Modal from 'react-modal';
import UserForm from './UserForm';

const EditUserModal = ({ isOpen, onRequestClose, initialData, onSubmit }) => {
  return (
    <Modal 
    isOpen={isOpen} 
    onRequestClose={onRequestClose}
    contentLabel="Edit User"
    className="inline-flex max-h-full animate-scale-in"
    overlayClassName="fixed w-full h-screen top-0 left-0 z-[1000] backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50"
    >
      <UserForm onSubmit={onSubmit} initialData={initialData} />
      <button type="button" className="btn btn-sm btn-circle" onClick={onRequestClose}>✕</button>
    </Modal>
  );
};

export default EditUserModal;
