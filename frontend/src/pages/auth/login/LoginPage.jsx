import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
//import XSvg from "../../../components/svgs/X";
 import Logo from "../../../components/common/Logo"
//import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const {mutate:loginMutation, 
		isPending, 
		isError, 
		error} = useMutation({
			mutationFn: async({ username, password }) => {
					// eslint-disable-next-line no-useless-catch
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
			//vuelve a cargar el para así cuando haga login me lleve a la pagina principal, invalidando la query de authUser ya que hace varios intentos
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		}
	})

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

    const location = useLocation();
	const verifiedOnceRef = useRef(false);
	const urlParams = new URLSearchParams(location.search);
	const verified = urlParams.get("verified");
    useEffect(() => {
        if (verified === "true" && !verifiedOnceRef.current) {
			verifiedOnceRef.current = true;
            // Mostrar el toast después de un pequeño retraso
            setTimeout(() => {
                toast.success("Tu correo electrónico ha sido verificado. Ahora puedes iniciar sesión.");
				console.log('i fire once');
            }, 1000); // Espera 1 segundo antes de mostrar el toast
        }
    }, []);


	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
			<Logo className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
				<Logo className='w-24 lg:hidden fill-white' />
					<h1 className="text-purple-500 text-4xl font-bold">VioQUIZ</h1>
					<h1 className='text-4xl font-extrabold text-primary'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
            <FaUser />
						<input
							type='text'
							className='grow'
							placeholder='Nombre de usuario'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Contraseña'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{isPending ? "Cargando..." : "Acceder"}</button>
					{isError && (
						<div role="alert" className="alert alert-error h-min">
							<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
							<span>{error.message || error.error}</span>
						</div>
					)}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-primary text-lg'>{"¿No"} tienes cuenta?</p>
					<Link to='/register'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Ir a registrarte</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;