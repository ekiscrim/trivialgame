import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Logo from "../../../components/common/Logo";
import { FaUser } from "react-icons/fa";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

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
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Revisa tu correo electrónico para verificar la cuenta", { duration: 4000 });
    }
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <Logo className=' lg:w-2/3 fill-white' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit(onSubmit)}>
          <Logo className='w-24 lg:hidden fill-white' />
          <h1 className="text-purple-500 text-4xl font-bold">VioQUIZ</h1>
          <h1 className='text-4xl font-extrabold text-primary'>Regístrate para participar</h1>

          <div className='flex gap-4 flex-wrap'>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <FaUser />
              <input
                type='text'
                className='grow'
                placeholder='Nombre de usuario'
                {...register("username", { 
                  required: "El nombre de usuario es obligatorio",
                  validate: value => !value.includes(" ") || "El nombre de usuario no puede contener espacios",
                  minLength: { value: 3, message: "El nombre de usuario debe tener al menos 3 caracteres" },
                  maxLength: { value: 15, message: "El nombre de usuario no puede tener más de 15 caracteres" }
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
          {errors.password && (<div className='error-message'>
                La contraseña debe cumplir con los siguientes requisitos:
                <ul>
                  <li>Al menos 8 caracteres de longitud</li>
                  <li>Al menos 2 números</li>
                  <li>Al menos 1 carácter especial (por ejemplo, !@#$%^&*)</li>
                </ul>
              </div>
            )}
          <button className='btn rounded-full btn-primary text-white' disabled={isSubmitting}>
            {isSubmitting ? "Cargando..." : "Registrarse"}
          </button>
        </form>
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
