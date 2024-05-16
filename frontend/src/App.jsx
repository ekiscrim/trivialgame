 import { Routes, Route } from "react-router-dom"
 import HomePage from './pages/home/HomePage'
 import RegisterPage from './pages/auth/signup/RegisterPage'
 import LoginPage from './pages/auth/login/LoginPage'
 import Sidebar from "./components/common/Sidebar"

function App() {

  return (
    <div className='flex max-w-6xl mx-auto'>
			<Sidebar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/login' element={<LoginPage />} />
			</Routes>
		</div>
  )
}

export default App
