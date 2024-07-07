const DeactivateModal = ({ handleDeactivate, setIsDeactivateModalOpen }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas desactivar tu cuenta?</h2>
        <div className="flex justify-between">
          <button
            onClick={() => {
              handleDeactivate();
              setIsDeactivateModalOpen(false);
            }}
            className='btn btn-danger mr-2'
          >
            Sí, desactivar cuenta
          </button>
          <button
            onClick={() => setIsDeactivateModalOpen(false)}
            className='btn btn-secondary'
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
  
  export default DeactivateModal;
  