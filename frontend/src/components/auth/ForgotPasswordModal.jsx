import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  
  const { mutate: forgotPasswordMutation } = useMutation({
    mutationFn: async (email) => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Ocurrió un error, intenta nuevamente.");
    }
  });

  const onSubmit = (data) => {
    forgotPasswordMutation(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <h2 className="text-2xl mb-4">Olvidaste tu contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='input input-bordered rounded flex items-center gap-2'>
            <input
              type='email'
              className='grow'
              placeholder='Correo electrónico'
              {...register("email", { required: "El correo electrónico es requerido" })}
            />
          </label>
          {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
          <button className='btn rounded-full btn-primary text-white mt-4' disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </form>
        <button className="mt-4 text-sm text-gray-600 underline" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
