 import { Routes, Route, Navigate } from "react-router-dom"
 import HomePage from './pages/home/HomePage'
 import RegisterPage from './pages/auth/signup/RegisterPage'
 import LoginPage from './pages/auth/login/LoginPage'
 import Sidebar from "./components/common/Sidebar"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"

function App() {
	//el hecho de usar una queryKey me permite tener un nombre unico con el que hacer referencia en cualquier sitioç
	//por ejemplo en otro fichero podria acceder a los datos del user simplemente haciendo
	// const {data: authUserQuery, isError, error} = useQuery({queryKey: ["authUser"]})
  const {data:authUserQuery} = useQuery({
	queryKey: ['authUser'],
	queryFn: async() => {
		try {
			const res = await fetch("/api/auth/me")
			const data = await res.json();
			if (data.error) return null; //para invalidar la query de authUser que viene desde el Siderbar.jsx y asi al desloguear me lleve a la home
			if (!res.ok || data.error) throw new Error(data.error ||"Algo fue mal");
			console.log("authUser está aquí: ", data);
			return data;
		} catch (error) {
			throw new Error(error)
		}
	},
	retry: false
  });

  /*if(isLoading) {
	return (
		<div>Cargando...poner aqui el componenete de spinner</div>
	)
  }*/

  return (
    <div className='flex max-w-6xl mx-auto'>
			{authUserQuery && <Sidebar />}
			<Routes>
				<Route path='/' element={authUserQuery ? <HomePage /> : <Navigate to="/login" /> }/>
				<Route path='/register' element={!authUserQuery ? <RegisterPage /> : <Navigate to="/" /> } />
				<Route path='/login' element={!authUserQuery ? <LoginPage /> : <Navigate to="/" />} />
			</Routes>
			<Toaster />
		</div>
  )
}

export default App
