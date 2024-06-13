import { useState, useEffect } from 'react';
import NotificationItem from '../../components/notifications/NotificationItem';
import NotificationModal from '../../components/notifications/NotificationModal';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: authUserData } = useQuery({ queryKey: ['authUser'] });

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                const data = await res.json();
                setNotifications(Array.isArray(data.data) ? data.data : []);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleOpenNotification = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseNotification = () => {
        setSelectedNotification(null);
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            const res = await fetch(`/api/notifications/${authUserData._id}/${notificationId}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete notification');
            }
            setNotifications((prevNotifications) =>
                prevNotifications.filter((notif) => notif._id !== notificationId)
            );
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto my-9 h-full pt-6">
            <h1 className="text-4xl font-bold text-center mb-8 text-cyan-300 uppercase">Notificaciones</h1>
            {notifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-4 m-2 text-center">
                    <p className="text-lg text-gray-800 mb-4">No tienes notificaciones 😊</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            userId={authUserData?._id}
                            notification={notification}
                            onOpenModal={handleOpenNotification}
                            onDelete={handleDeleteNotification}
                        />
                    ))}
                </div>
            )}
            {selectedNotification && (
                <NotificationModal
                    notification={selectedNotification}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};

export default NotificationsPage;
