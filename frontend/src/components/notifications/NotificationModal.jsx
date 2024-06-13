import DOMPurify from 'dompurify';
import { useEffect } from 'react';

const NotificationModal = ({ notification, onClose }) => {
    const sanitizedHTML = DOMPurify.sanitize(notification.notification.message);

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const handleOutsideClick = (event) => {
            if (event.target.classList.contains('modal-background')) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 max-w-lg w-full md:max-w-3xl max-h-full overflow-y-auto">
                {/* Close button */}
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {/* Notification title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{notification.notification.title}</h2>
                
                {/* Message content with fixed height and scroll */}
                <div className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></div>
                
                {/* Notification timestamp */}
                <span className="text-xs text-gray-400 block">{new Date(notification.createdAt).toLocaleString()}</span>
            </div>

            {/* Modal background click handler */}
            <div className="fixed inset-0 z-40 bg-black bg-opacity-50 modal-background"></div>
        </div>
    );
};

export default NotificationModal;
