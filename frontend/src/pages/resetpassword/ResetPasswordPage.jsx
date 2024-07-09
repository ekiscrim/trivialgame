// src/pages/auth/reset-password/ResetPasswordPage.js
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenValid, setTokenValid] = useState(null); // Estado para la validez del token
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          window.location.href = '/'
        }
      } catch (error) {
        setTokenValid(false);
         window.location.href = '/'
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
       window.location.href = '/'
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        toast.success('Contraseña restablecida correctamente');
        navigate('/login');
      } else {
        toast.success('Error al restablecer la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al restablecer la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenValid === null) {
    return <div>Loading...</div>;
  }

  if (!tokenValid) {
    return <div>Token inválido o expirado</div>;
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
        <h1 className='text-3xl italic text-primary'>Restablecer Contraseña</h1>
        <label className='input input-bordered rounded flex items-center gap-2'>
          <input
            type='password'
            className='grow'
            placeholder='Nueva contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.newPassword && <p className='text-red-500'>{errors.newPassword}</p>}
        <label className='input input-bordered rounded flex items-center gap-2'>
          <input
            type='password'
            className='grow'
            placeholder='Confirmar nueva contraseña'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword}</p>}
        <button className='btn rounded-full btn-primary text-white' disabled={isSubmitting}>
          {isSubmitting ? "Cargando..." : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
