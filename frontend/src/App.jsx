import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import RegisterPage from './pages/auth/signup/RegisterPage';
import LoginPage from './pages/auth/login/LoginPage';
import RoomPage from "./pages/room/RoomPage";
import Navbar from "./components/common/Navbar";
import Footer from './components/common/Footer';
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import QuestionPage from "./pages/question/QuestionPage";
import AdminPage from "./pages/admin/AdminPage";
import ProtectedRoute from "./components/admin/ProtectedRoutes";
import Modal from 'react-modal';
import ResultsPage from "./pages/results/ResultsPage";
import useDeviceDetection from "./hooks/useDeviceDetection";
import RankingsPage from "./pages/ranking/RankingPage";
import ScrollToTop from "react-scroll-to-top";
import { useLocation } from 'react-router-dom';
import { ConsentBanner, ConsentProvider } from 'react-hook-consent';
import PrivacyPolicy from './components/common/PrivacyPolicy';
import 'react-hook-consent/dist/styles/style.css';
import NotificationsPage from './pages/notifications/NotificationsPage';
import AboutUs from './pages/footer/AboutUs';
import HelpCenter from './pages/footer/HelpCenter';
import ContactUs from './pages/footer/ContactUs';
import FAQ from './pages/footer/FAQ';
import TermsOfService from './pages/footer/TermsOfService';
import CookiesPolicy from './pages/footer/CookiesPolicy';
import ResetPasswordPage from './pages/resetpassword/ResetPasswordPage';

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

  const device = useDeviceDetection();
  const location = useLocation();
  const isQuestionPage = /^\/room\/[a-zA-Z0-9]+\/questions\/([a-zA-Z0-9]+,?)+$/.test(location.pathname);

  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = React.useState(false);

  const handlePrivacyPolicyModalClose = () => {
    setIsPrivacyPolicyModalOpen(false);
  }

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`grid min-h-screen ${device === 'Mobile' ? 'pb-16' : ' place-items-center pt-20'}`}>
      <ConsentProvider
        options={{
          services: [
            {
              id: 'jwt-cookie',
              name: 'JWT Cookie',
              cookies: [
                { pattern: 'jwt' }
              ],
              mandatory: true
            },
            {
              id: 'cloudinary-cookies',
              name: 'Cloudinary Cookies',
              cookies: [
                { pattern: '__cfruid' },
                { pattern: '_cfuvid' },
                { pattern: '_ga' },
                { pattern: '_ga_NKMQJY2D2H' },
              ],
              mandatory: true
            }
          ],
          theme: 'light',
        }}
      >
        <ConsentBanner
          settings={{ hidden: false, label: 'Mostrar más', modal: { title: 'Consentimientos de Cookies', description: 'En este sitio web utilizamos cookies. Algunos de ellos son esenciales, otros nos ayudan a mejorar su experiencia de navegación como proveer imágenes. Para una mejor experiencia, marque las opciones,' } }}
          decline={{ hidden: false, label: 'No' }}
          approve={{ label: 'Sí' }}
        >
          <>
            VioQUIZ.me utiliza cookies para mejorar la experiencia del usuario. <br />
            <button onClick={() => setIsPrivacyPolicyModalOpen(true)}><strong> Política de privacidad</strong></button>
          </>
        </ConsentBanner>
        <Routes>
          <Route path='/' element={authUserQuery ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/register' element={!authUserQuery ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path='/login' element={!authUserQuery ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/profile/:username' element={authUserQuery ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path='/rooms/join/:id' element={authUserQuery ? <RoomPage /> : <Navigate to="/" />} />
          <Route path='/rooms/:id' element={authUserQuery ? <RoomPage /> : <Navigate to="/login" />} />
          <Route path='/room/:roomId/questions/:categoryId' element={authUserQuery ? <QuestionPage /> : <Navigate to="/login" />} />
          <Route path="/room/:roomId/results" element={authUserQuery ? <ResultsPage /> : <Navigate to="/login" />} />
          <Route path="/rankings" element={authUserQuery ? <RankingsPage /> : <Navigate to="/login" />} />
          <Route path='/notifications' element={authUserQuery ? <NotificationsPage /> : <Navigate to="/login" />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/help-center' element={<HelpCenter />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/FAQ' element={<FAQ />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/terms-of-service' element={<TermsOfService />} />
          <Route path='/cookies-policy' element={<CookiesPolicy />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/admin' element={<ProtectedRoute element={AdminPage} authUser={authUserQuery} adminOnly />} />
        </Routes>
        <ScrollToTop style={{ marginBottom: "40px", paddingLeft: "6px", right: "10px" }} smooth />
        <Toaster />
        {authUserQuery && (!isQuestionPage || device !== 'Mobile') && <Navbar device={device} />}
        {(!isQuestionPage) && <Footer />}
        
      </ConsentProvider>
      {isPrivacyPolicyModalOpen && (
        <Modal isOpen={isPrivacyPolicyModalOpen} onRequestClose={handlePrivacyPolicyModalClose}>
          <PrivacyPolicy />
          <button onClick={handlePrivacyPolicyModalClose}>Cerrar</button>
        </Modal>
      )}
    </div>
  );
}

export default App;
