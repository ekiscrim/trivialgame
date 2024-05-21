import { useState } from 'react';
import CategoriesTab from '../../components/admin/CategoriesTab';
// import QuestionsTab from '../../components/admin/QuestionsTab';
// import UsersTab from '../../components/admin/UsersTab';
// import RoomsTab from '../../components/admin/RoomsTab';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const renderTab = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoriesTab />;
      case 'questions':
        // return <QuestionsTab />;
        return;
      case 'users':
        // return <UsersTab />;
        return;
      case 'rooms':
        // return <RoomsTab />;
        return;
      default:
        return <CategoriesTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="tabs tabs-boxed w-full flex justify-center bg-gray-200 py-4">
        <button
          className={`tab ${activeTab === 'categories' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`tab ${activeTab === 'questions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Questions
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === 'rooms' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Rooms
        </button>
      </div>
      <div className="flex-grow w-full p-4">
        {renderTab()}
      </div>
    </div>
  );
};

export default AdminPage;
