import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import RegisterPage from './pages/auth/signup/RegisterPage';
import LoginPage from './pages/auth/login/LoginPage';
import RoomPage from "./pages/room/RoomPage";
import Navbar from "./components/common/Navbar";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import QuestionPage from "./pages/question/QuestionPage";
import AdminPage from "./pages/admin/AdminPage";
import ProtectedRoute from "./components/admin/ProtectedRoutes";
import Modal from 'react-modal';
import ResultsPage from "./pages/results/ResultsPage";

// Establecer el elemento raíz para Modal
Modal.setAppElement('#root');

function App() {
  const { data: authUserQuery, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok || data.error) throw new Error(data.error || "Algo fue mal");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className='grid place-items-center min-h-screen pt-20 bg-purple-950'>
      {authUserQuery && <Navbar />}
      <Routes>
        <Route path='/' element={authUserQuery ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/register' element={!authUserQuery ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUserQuery ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/profile/:username' element={authUserQuery ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path='/rooms/join/:id' element={authUserQuery ? <RoomPage /> : <Navigate to="/" />} />
        <Route path='/rooms/:id' element={authUserQuery ? <RoomPage /> : <Navigate to="/login" />} />
        <Route path='/room/:roomId/questions/:categoryId' element={authUserQuery ? <QuestionPage /> : <Navigate to="/login" />} />
        <Route path="/room/:roomId/results" element={authUserQuery ? <ResultsPage /> : <Navigate to="/login" />} />
        <Route path='/admin' element={<ProtectedRoute element={AdminPage} authUser={authUserQuery} adminOnly />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
