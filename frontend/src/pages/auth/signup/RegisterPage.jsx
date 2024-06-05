import { Link } from "react-router-dom";
import { useState } from "react";

import Logo from "../../../components/common/Logo";

//import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
//import { MdDriveFileRenameOutline } from "react-icons/md";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		email: "",
	});

	const {mutate, isError, isPending, error} = useMutation({
		mutationFn: async ({username, password, email}) => {
			try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({username, password, email})
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

	const handleSubmit = (e) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<Logo className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<Logo className='w-24 lg:hidden fill-white' />
					<h1 className="text-purple-500 text-4xl font-bold">VioQUIZ</h1>
					<h1 className='text-4xl font-extrabold text-primary'>Registrate para participar</h1>

					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Nombre de usuario'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
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
					<button className='btn rounded-full btn-primary text-white'>{isPending ? "Cargando...": "Registrarse"}</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-primary text-lg'>¿Ya tienes una cuenta?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Acceder</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default RegisterPage;