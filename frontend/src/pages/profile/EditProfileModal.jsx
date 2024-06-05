import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({ authUser }) => {
  const navigateTo = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/users/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Algo fue mal");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      toast.success("Perfil editado correctamente");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);

      if (data.username !== authUser.username) {
        navigateTo(`/profile/${data.username}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const onSubmit = async (formData) => {
    try {
      updateProfile(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        className='btn btn-primary rounded-full btn-sm '
        onClick={() => document.getElementById("edit_profile_modal").showModal()}
      >
        Editar perfil
      </button>
      <dialog id='edit_profile_modal' className='modal'>
        <div className='modal-box border rounded-md border-gray-700 shadow-md'>
          <button className='btn btn-sm btn-circle absolute top-2 right-2 ' onClick={() => document.getElementById("edit_profile_modal").close()}>X</button>
          <h3 className='font-bold text-lg my-3'>Editar datos de perfil</h3>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='flex flex-wrap gap-2'>
              <input
                type='text'
                placeholder='Nombre de usuario'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                defaultValue={authUser.username}
                {...register('username', { required: true })}
              />
              {errors.username && <span className="text-red-500">Este campo es requerido</span>}
            </div>
            <div className='flex flex-wrap gap-2'>
              <input
                type='password'
                placeholder='Contraseña actual'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                {...register('currentPassword', { required: true })}
              />
              {errors.currentPassword && <span className="text-red-500">Este campo es requerido</span>}
              <input
                type='password'
                placeholder='Nueva contraseña'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                {...register('newPassword')}
              />
            </div>
            <button type="submit" className='btn btn-primary rounded-full btn-sm text-white'>
              {isUpdatingProfile ? "Actualizando perfil..." : "Editar"}
            </button>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
