import AvatarEditor from "react-avatar-editor";

const ImageModal = ({ editorRef, selectedImage, handleProfileUpdate, setIsImageModalOpen, setSelectedImage }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-lg">
      <AvatarEditor
        ref={editorRef}
        image={selectedImage}
        width={250}
        height={250}
        border={50}
        color={[255, 255, 255, 0.6]} // RGBA
        scale={1.2}
        rotate={0}
        borderRadius={200}
      />
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setIsImageModalOpen(false);
            setSelectedImage(null);
          }}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            const formData = new FormData();
            setIsImageModalOpen(false);
            handleProfileUpdate(formData);
          }}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  </div>
);

export default ImageModal;
