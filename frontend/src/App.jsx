import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from './pages/home/HomePage'
import RegisterPage from './pages/auth/signup/RegisterPage'
import LoginPage from './pages/auth/login/LoginPage'
import RoomPage from "./pages/room/RoomPage"
import Navbar from "./components/common/Navbar"
import ProfilePage from "./pages/profile/ProfilePage"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner";
import QuestionPage from "./pages/question/QuestionPage"

import AdminPage from "./pages/admin/AdminPage"
import ProtectedRoute from "./components/admin/ProtectedRoutes"
//import ProtectedRoute from 

function App() {
	//el hecho de usar una queryKey me permite tener un nombre unico con el que hacer referencia en cualquier sitioç
	//por ejemplo en otro fichero podria acceder a los datos del user simplemente haciendo
	// const {data: authUserQuery, isError, error} = useQuery({queryKey: ["authUser"]})
  const {data:authUserQuery, isLoading} = useQuery({
	queryKey: ['authUser'],
	queryFn: async() => {
		try {
			const res = await fetch("/api/auth/me")
			const data = await res.json();
			if (data.error) return null; //para invalidar la query de authUser que viene desde el Navbar.jsx y asi al desloguear me lleve a la home
			if (!res.ok || data.error) throw new Error(data.error ||"Algo fue mal");
			//console.log("authUser está aquí: ", data);
			return data;
		} catch (error) {
			throw new Error(error)
		}
	},
	retry: false
  });
  //muy importante el isLoading, de no hacerlo, se mostrará la pantalla de login por un segundo, y al ser el que comprueba que estás logueado,
  //necesitamos que esto termine para mostrar la página en cuestión, si no dará problemas de redirección a la home por ejemplo o al login
  if(isLoading) {
	return (
		<div className="h-screen flex justify-center items-center">
			<LoadingSpinner size="lg" />
		</div>
	)
  }

  return (
    <div className='grid place-items-center min-h-screen pt-20 bg-gray-100'>
			{authUserQuery && <Navbar />}
			<Routes>
				<Route path='/' element={authUserQuery ? <HomePage /> : <Navigate to="/login" /> }/>
				<Route path='/register' element={!authUserQuery ? <RegisterPage /> : <Navigate to="/" /> } />
				<Route path='/login' element={!authUserQuery ? <LoginPage /> : <Navigate to="/" />} />
				<Route path='/profile/:username' element={authUserQuery ? <ProfilePage /> : <Navigate to="/login" />} />
				<Route path='/rooms/join/:id' element={authUserQuery ? <RoomPage /> : <Navigate to="/" />} />
				<Route path='/rooms/:id' element={authUserQuery ? <RoomPage /> : <Navigate to="/login" />} />
				<Route path='/room/:roomId/questions/:categoryId' element={authUserQuery ? <QuestionPage  /> : <Navigate to="/login" />} />
				<Route path='/admin' element={<ProtectedRoute element={AdminPage} authUser={authUserQuery} adminOnly />} />
			</Routes>
			<Toaster />
		</div>
  )
}

export default App
