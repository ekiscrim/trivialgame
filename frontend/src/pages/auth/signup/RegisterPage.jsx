import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Logo from "../../../components/common/Logo";
import { FaUser } from "react-icons/fa";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaGoogle } from 'react-icons/fa';
import Logo2 from "../../../components/common/Logo2";

const reservedUsernames = ['admin', 'root', 'all', 'system'];

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [email, setEmail] = useState(""); // Estado para el correo electrónico

  const { mutate } = useMutation({
    mutationFn: async ({ username, password, email }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password, email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Algo fue mal");
        return data;
      } catch (error) {
        throw new Error(error || 'Algo salió mal');
      }
    },
    onSuccess: () => {
      toast.success("Revisa tu correo electrónico para verificar la cuenta", { duration: 6000 });
      setFormSubmitted(true);
    }
  });

  const handleResendVerification = async () => {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Utiliza el estado del correo electrónico
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Algo salió mal');
      }

      toast.success(data.message, { duration: 4000 });
    } catch (error) {
      console.error('Error al reenviar el correo electrónico de verificación:', error);
      toast.error('Error al reenviar el correo electrónico de verificación. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setFormSubmitted(false); // Restablece el estado de envío del formulario
    }
  };

  const onSubmit = (data) => {
    mutate(data);
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

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <Logo2 className=' lg:w-2/3 ' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center -mt-20'>
        <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit(onSubmit)}>
          <Logo2 className='w-24 lg:hidden ' />
          <h1 className='text-3xl italic text-primary'>Regístrate para participar.</h1>

          <div className='flex gap-4 flex-wrap'>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <FaUser />
              <input
                type='text'
                className='grow'
                placeholder='Nombre de usuario'
                {...register("username", { 
                  required: "El nombre de usuario es obligatorio",
                  validate: {
                    noSpaces: value => !value.includes(" ") || "El nombre de usuario no puede contener espacios",
                    validLength: value => (value.length >= 3 && value.length <= 15) || "El nombre de usuario debe tener entre 3 y 15 caracteres",
                    noReserved: value => !reservedUsernames.includes(value.toLowerCase()) || "El nombre de usuario no está permitido",
                    noSpecialChars: value => /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜ]+$/.test(value) || "El nombre de usuario solo puede contener letras (la ñ no está incluída) o números"
                  }
                })}
              />
            </label>
            {errors.username && <p className='error-message'>{errors.username.message}</p>}
          </div>
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdOutlineMail />
            <input
              type='email'
              className='grow'
              placeholder='Email'
              {...register("email", { required: "El email es obligatorio" })}
              value={email} // Estado para el correo electrónico
              onChange={(e) => setEmail(e.target.value)} // Maneja el cambio en el estado del correo electrónico
            />
          </label>
          {errors.email && <p className='error-message'>{errors.email.message}</p>}
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdPassword />
            <input
              type='password'
              className='grow'
              placeholder='Contraseña'
              {...register("password", { 
                required: "La contraseña es requerida",
                pattern: {
                  value: /^(?=.*[0-9].*[0-9])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
                  message: "La contraseña debe tener al menos 8 caracteres, 2 números y un carácter especial"
                }
              })}
            />
          </label>
          {errors.password && (
            <div className='error-message'>
              La contraseña debe cumplir con los siguientes requisitos:
              <ul>
                <li>Al menos 8 caracteres de longitud</li>
                <li>Al menos 2 números</li>
                <li>Al menos 1 carácter especial (por ejemplo, !@#$%^&*)</li>
              </ul>
            </div>
          )}

          {/* Mostrar el botón de reenvío de verificación solo si el formulario se ha enviado con éxito */}
          {formSubmitted && (
            <button
              type='button' // Cambia el tipo de botón a 'button'
              className='btn rounded-full btn-primary text-white'
              disabled={isSubmitting}
              onClick={handleResendVerification} // Maneja el clic para reenviar la verificación
            >
              {isSubmitting ? "Cargando..." : "Reenviar verificación"}
            </button>
          )}

          <button className='btn rounded-full btn-primary text-white' disabled={isSubmitting}>
            {isSubmitting ? "Cargando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-white text-center mt-6">Si lo prefieres, puedes registrarte utilizando tu cuenta de Google</p>
        <div className="mt-6">
          {/* Botón de acceso con Google - Estilo 1 */}
          <button
            className='btn-google'
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="google-icon" />
            <span className="btn-text">Registrarse con Google</span>
          </button>
        </div>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-primary text-lg'>¿Ya tienes una cuenta?</p>
          <Link to='/login'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Iniciar sesión</button>
          </Link>
        </div>
      </div>
    </div>
  );

};

export default RegisterPage;
