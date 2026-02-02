import React from 'react';
import { useAuth } from '../context/AuthContext';

type PageId = 'statistics' | 'ZAKUP' | 'options' | 'map' | 'help' | 'admin';

interface SidebarProps {
  activePage: PageId;
  onPageChange: (pageId: PageId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const { logout, currentUser } = useAuth();

  return (
    <div className="sidebar">
      <button 
        className={`sidebar-nav-btn ${activePage === 'statistics' ? 'active' : ''}`}
        onClick={() => onPageChange('statistics')}
      >
        Услуги связи
      </button>
      <button 
        className={`sidebar-nav-btn ${activePage === 'ZAKUP' ? 'active' : ''}`}
        onClick={() => onPageChange('ZAKUP')}
      >
        Закупки
      </button>
      <button 
        className={`sidebar-nav-btn ${activePage === 'options' ? 'active' : ''}`}
        onClick={() => onPageChange('options')}
      >
        Сотовая связь
      </button>
      <button 
        className={`sidebar-nav-btn ${activePage === 'map' ? 'active' : ''}`}
        onClick={() => onPageChange('map')}
      >
        Карта объектов
      </button>
      <button 
        className={`sidebar-nav-btn ${activePage === 'help' ? 'active' : ''}`}
        onClick={() => onPageChange('help')}
      >
        Спутниковая связь
      </button>

      {currentUser?.role === 'АДМ' && (
        <button 
          className={`sidebar-nav-btn ${activePage === 'admin' ? 'active' : ''}`}
          onClick={() => onPageChange('admin')}
        >
          Личный кабинет
        </button>
      )}

      <div className="sidebar-footer">
        <p className="sidebar-user">Пользователь: {currentUser?.username}</p>
        <button className="btn-logout" onClick={logout}>
          Выход
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
