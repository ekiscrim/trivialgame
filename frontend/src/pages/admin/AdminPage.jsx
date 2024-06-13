import { useState } from 'react';
import Tab from '../../components/admin/Tab';
import CategoriesTab from '../../components/admin/CategoriesTab';
import QuestionsTab from '../../components/admin/QuestionsTab';
import UsersTab from '../../components/admin/UsersTab';
import RoomsTab from '../../components/admin/RoomsTab';
import NotificationForm from '../../components/admin/NotificationsForm';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { title: 'Categorías', key: 'categories' },
    { title: 'Preguntas', key: 'questions' },
    { title: 'Usuarios', key: 'users' },
    { title: 'Salas', key: 'rooms' },
    { title: 'Notificaciones', key: 'notifications' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoriesTab />;
      case 'questions':
        return <QuestionsTab />;
      case 'users':
        return <UsersTab />;
      case 'rooms':
        return <RoomsTab />;
      case 'notifications':
        return <NotificationForm />;
      default:
        return <CategoriesTab />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="w-11/12 max-w-screen-md bg-gray-100 p-6 rounded-md shadow-md">
        <div className="tabs tabs-boxed flex flex-wrap justify-center bg-gray-200 py-4">
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              title={tab.title}
              isActive={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="w-full sm:w-auto flex-grow"
            />
          ))}
        </div>
        <div className="mt-4">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
