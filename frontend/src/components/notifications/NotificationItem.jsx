import DOMPurify from 'dompurify';
import LoadingSpinner from '../common/LoadingSpinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const NotificationItem = ({ notification, onOpenModal, userId, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const [read, setRead] = useState(notification.read);
    const queryClient = useQueryClient();

    const { mutate: markAsReadMutation } = useMutation({
        mutationFn: async (notificationId) => {
            setLoading(true);
            try {
                const res = await fetch(`/api/notifications/${userId}/${notificationId}/read`, {
                    method: 'PUT',
                });
                if (!res.ok) {
                    throw new Error('Failed to mark notification as read');
                }
                setRead(true);
                queryClient.invalidateQueries('notifications'); // Invalidar la query después de marcar como leída
            } catch (error) {
                console.error('Error marking notification as read:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
    });

    const handleNotificationClick = async () => {
        try {
            await markAsReadMutation(notification._id);
            onOpenModal(notification);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleDeleteNotification = async () => {
        setLoading(true);
        try {
            await onDelete(notification._id);
            queryClient.invalidateQueries('notifications'); // Invalidar la query después de eliminar la notificación
        } catch (error) {
            console.error('Failed to delete notification:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener los primeros 100 caracteres del mensaje limpio
    const getShortenedMessage = () => {
        const maxLength = 100;
        // Utilizar DOMPurify para limpiar el mensaje de notificación de cualquier HTML potencialmente peligroso
        const sanitizedHTML = DOMPurify.sanitize(notification.notification.message);
        // Eliminar etiquetas HTML y espacios en blanco adicionales antes de truncar el mensaje
        const cleanedMessage = sanitizedHTML.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
        // Truncar el mensaje limpio a los primeros maxLength caracteres
        const truncatedMessage = cleanedMessage.substring(0, maxLength);
        return `${truncatedMessage}${cleanedMessage.length > maxLength ? '...' : ''}`;
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-4 m-2 transition duration-300 ease-in-out transform hover:scale-105 ${read ? 'opacity-70' : ''}`}
            style={{ cursor: 'pointer' }}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{notification.notification.title}</h3>
                {read ? (
                    <span className="text-xs text-gray-500">Leído</span>
                ) : (
                    <span className="text-xs text-purple-500">Nuevo</span>
                )}
            </div>
            <p className="text-sm text-gray-600 mt-2">{getShortenedMessage()}</p>
            <div className="flex justify-between mt-2">
                <button
                    className={`px-3 py-1 text-xs text-white rounded ${read ? 'bg-gray-400 cursor-default' : 'bg-purple-600 hover:bg-purple-700 focus:outline-none'}`}
                    onClick={handleNotificationClick}
                    disabled={loading}
                >
                    {loading ? <LoadingSpinner /> : 'Ver Detalles'}
                </button>
                <button
                    className={`ml-2 px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none`}
                    onClick={handleDeleteNotification}
                    disabled={loading}
                >
                    {loading ? <LoadingSpinner /> : 'Eliminar'}
                </button>
            </div>
        </div>
    );
};

export default NotificationItem;
