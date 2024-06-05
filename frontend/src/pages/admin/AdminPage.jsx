import { useState } from 'react';
import Tab from '../../components/admin/Tab';
import CategoriesTab from '../../components/admin/CategoriesTab';
import QuestionsTab from '../../components/admin/QuestionsTab';
// import UsersTab from '../../components/admin/UsersTab';
// import RoomsTab from '../../components/admin/RoomsTab';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { title: 'Categories', key: 'categories' },
    { title: 'Questions', key: 'questions' },
    { title: 'Users', key: 'users' },
    { title: 'Rooms', key: 'rooms' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoriesTab />;
      case 'questions':
        return <QuestionsTab />;
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
    <div className="min-h-screen w-full flex flex-col items-center ">
      <div className="w-11/12 max-w-screen-md bg-gray-100 p-6 rounded-md shadow-md">
        <div className="tabs tabs-boxed flex justify-center bg-gray-200 py-4">
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              title={tab.title}
              isActive={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
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
