import { useState } from "react";
import { Link } from "react-router-dom";
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

						if (!res.ok) throw new Error(data.message || "Algo fue mal");
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

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<Logo width={260} height={260} className='mr-20 mb-20' />
				
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<Logo width={160} height={160} className='lg:hidden' />
					<h1 className="text-purple-500 text-4xl font-bold">TRIVIALITE</h1>
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
					{isError && <p className='text-red-500'>{error.message}</p>}
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