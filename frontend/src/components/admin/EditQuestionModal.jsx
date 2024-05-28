import { useRef, useState } from 'react';
import Modal from 'react-modal';
import AvatarEditor from 'react-avatar-editor';

const EditQuestionModal = ({ isOpen, onRequestClose, categories, editFormData, setEditFormData, onSubmit, isDirty }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const editorRef = useRef(null);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditFormData({ ...editFormData, image: file });
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleImageEdit = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const url = canvas.toDataURL();
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'editedImage.png', { type: 'image/png' });
          setEditFormData({ ...editFormData, image: file });
        });
    }
  };

  const handleCloseModal = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to save them before closing?');
      if (confirmed) {
        onSubmit(new Event('submit'));
      } else {
        onRequestClose();
      }
    } else {
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      shouldCloseOnOverlayClick={true}
      contentLabel="Edit Question"
      className="inline-flex max-h-full animate-scale-in"
      overlayClassName="fixed w-full h-screen top-0 left-0 z-[1000] backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50"
    >
      {editFormData && (
        <form onSubmit={onSubmit} className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto overflow-y-auto max-h-full">
          <button type="button" className="btn btn-sm btn-circle" onClick={handleCloseModal}>✕</button>
          <h2 className="text-xl font-semibold mb-4">Edit Question</h2>
          {editFormData.image && (
            <div>
                <img src={editFormData.image} alt="" />
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Question</span>
            </label>
            <input type="text" name="question" value={editFormData.question} onChange={handleEditChange} className="input input-bordered w-full" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select name="category" value={editFormData.category} onChange={handleEditChange} className="input input-bordered w-full">
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.title}</option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            {editFormData.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={e => {
                  const newOptions = [...editFormData.options];
                  newOptions[index] = e.target.value;
                  setEditFormData({ ...editFormData, options: newOptions });
                }}
                className="input input-bordered w-full"
              />
            ))}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Correct Answer</span>
            </label>
            <select name="correctAnswer" value={editFormData.correctAnswer} onChange={handleEditChange} className="input input-bordered w-full">
              <option value="">Select the correct answer</option>
              {editFormData.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-control mt-6 mb-2">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
              <>
                <AvatarEditor
                  ref={editorRef}
                  image={selectedImage}
                  width={250}
                  height={250}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1}
                  rotate={0}
                />
                
                <button type="button" className="btn btn-secondary mt-4" onClick={handleImageEdit}>
                  Edit Image
                </button>
              </>
            )}
          </div>
          <button type="submit" className="btn btn-primary mt-4 w-full">Update Question</button>
        </form>
      )}
    </Modal>
  );
};

export default EditQuestionModal;
