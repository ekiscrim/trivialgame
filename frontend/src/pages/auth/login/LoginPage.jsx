import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaUser } from "react-icons/fa";
import Logo from "../../../components/common/Logo";
import ForgotPasswordModal from "../../../components/auth/ForgotPasswordModal";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Logo2 from "../../../components/common/Logo2";

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const queryClient = useQueryClient();
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const { mutate: loginMutation, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || data.error);
        return data;

      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Bienvenido a la mejor página de QUIZ TRIVIAL");
      // Vuelve a cargar la página para redirigir al usuario a la página principal después del inicio de sesión
      window.location.reload();
    }
  });

  const onSubmit = (data) => {
    loginMutation(data);
  };

  const handleGoogleLogin = async () => {
    try {
      // Redirigir a la ruta de autenticación de Google
      window.location.href = "https://vioquiz.me/api/auth/google";
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      toast.error("Error al iniciar sesión con Google. Por favor, inténtelo de nuevo.");
    }
  };


  const location = useLocation();
  const verifiedOnceRef = useRef(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const verified = urlParams.get("verified");

    if (verified === "true" && !verifiedOnceRef.current) {
      verifiedOnceRef.current = true;
      setTimeout(() => {
        toast.success("Tu correo electrónico ha sido verificado. Ahora puedes iniciar sesión.", { duration: 4000 });
      }, 4000); 
    }
  }, [location.search]);

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen'>
      <div className='flex-1 hidden lg:flex items-center  justify-center'>
        <Logo2 className='lg:w-2/3' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='flex gap-2 flex-col' onSubmit={handleSubmit(onSubmit)}>
          <Logo2 className='w-24 lg:hidden mt-10' />
          <h1 className='text-3xl italic text-primary'>{"Desafía"} tu mente</h1>
          <h1 className='text-2xl italic text-primary -mt-4 ml-7'>{"Conquista"} lo trivial.</h1>
          <label className='input input-bordered rounded flex items-center gap-2'>
            <FaUser />
            <input
              type='text'
              className='grow'
              placeholder='Nombre de usuario'
              {...register("username", { required: "El nombre de usuario es requerido" })}
            />
          </label>
          {errors.username && <p className='text-red-500'>{errors.username.message}</p>}
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdPassword />
            <input
              type='password'
              className='grow'
              placeholder='Contraseña'
              {...register("password", { required: "La contraseña es requerida" })}
            />
          </label>
          {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
          <button className='btn rounded-full btn-primary text-white' disabled={isSubmitting}>
            {isSubmitting ? "Cargando..." : "Acceder"}
          </button>
          {isError && (
            <div role="alert" className="alert alert-error h-min">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error.message || error.error}</span>
            </div>
          )}
        </form>
        <div className="mt-6">
          {/* Botón de acceso con Google - Estilo 1 */}
          <button
            className='btn-google'
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="google-icon" />
            <span className="btn-text">Acceder con Google</span>
          </button>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
          <p className='text-primary text-lg'>{"¿No"} tienes cuenta?</p>
          <Link to='/register'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Crear cuenta</button>
          </Link>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
          <p className='text-primary text-lg'>{"¿Olvidaste"} tu contraseña?</p>
          <button 
            className='btn rounded-full btn-primary text-white btn-outline w-full mb-20'
            onClick={() => setIsForgotPasswordModalOpen(true)}
          >
            Restablecer contraseña
          </button>
        </div>
      </div>
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />
    </div>
  );
};

export default LoginPage;