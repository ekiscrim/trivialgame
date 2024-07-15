import React, { useState } from 'react';
import { HiMenu } from 'react-icons/hi';

const Tabs = ({ activeTab, onTabChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setMenuOpen(false); // Cerrar el menú al seleccionar una pestaña
    if (tab !== activeTab) {
      if (tab === 'pending') {
        // Si el usuario hace clic en "Salas por hacer", llama a la función sortRoomsWithoutScore
        onTabChange(tab, true);
      } else {
        onTabChange(tab);
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <div className="relative flex items-center">
      <h1
        className="text-3xl font-bold uppercase text-primary hover:text-purple-600  cursor-pointer relative z-10"
        onClick={toggleMenu}
      >
        {activeTab === 'waiting' ? 'Salas Abiertas' :
          activeTab === 'finished' ? 'Salas Cerradas' :
          activeTab === 'created' ? 'Mis Salas' :
          activeTab === 'pending' ? 'Salas por hacer' :
          activeTab === 'category' ? 'Categorías' : ''}
      </h1>
      <button
        className="tab-menu-button ml-2 flex items-center justify-center w-10 h-10 text-white  hover:bg-purple-600 focus:outline-none focus:bg-purple-600 focus:text-white rounded-full shadow-lg relative z-10"
        onClick={toggleMenu}
      >
        <HiMenu className="w-6 h-6 md:w-8 md:h-8 text-primary" /> {/* Ajustar el tamaño y color del icono aquí */}
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <a
            href="#"
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
              activeTab === 'waiting' ? 'bg-gray-100 text-gray-900' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('waiting');
            }}
          >
            Salas Abiertas
          </a>
          <a
            href="#"
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
              activeTab === 'finished' ? 'bg-gray-100 text-gray-900' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('finished');
            }}
          >
            Salas Cerradas
          </a>
          <a
            href="#"
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
              activeTab === 'pending' ? 'bg-gray-100 text-gray-900' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('pending');
            }}
          >
            Salas Por Hacer
          </a>
          
          <a
            href="#"
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
              activeTab === 'created' ? 'bg-gray-100 text-gray-900' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('created');
            }}
          >
            Mis Salas
          </a>
          {/*<a
            href="#"
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
              activeTab === 'category' ? 'bg-gray-100 text-gray-900' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('category');
            }}
          >
            Categorías
          </a>*/}
        </div>
      )}
    </div>
  );
};

export default Tabs;
