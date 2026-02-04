import React from 'react';
import { useAuth } from '../context/AuthContext';

type PageId = 'home' | 'statistics' | 'statistics-us741' | 'statistics-forecasts' | 'ZAKUP' | 'zakup-onm' | 'zakup-pen' | 'zakup-spravochnik' | 'dogovory' | 'options' | 'options-tariffs' | 'map' | 'help' | 'help-iridium' | 'admin';

interface SidebarProps {
  activePage: PageId;
  onPageChange: (pageId: PageId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const { logout, currentUser, isSectionVisible } = useAuth();

  return (
    <div className="sidebar">
      <button
        className={`sidebar-nav-btn ${activePage === 'home' ? 'active' : ''}`}
        onClick={() => onPageChange('home')}
      >
        Главная страница
      </button>

      {isSectionVisible('statistics') && (
        <>
          <button 
            className={`sidebar-nav-btn ${activePage === 'statistics' ? 'active' : ''}`}
            onClick={() => onPageChange('statistics')}
          >
            Услуги связи
          </button>
          <button
            className={`sidebar-sub-btn ${activePage === 'statistics-us741' ? 'active' : ''}`}
            onClick={() => onPageChange('statistics-us741')}
          >
            └ Услуги связи УС741
          </button>
          <button
            className={`sidebar-sub-btn ${activePage === 'statistics-forecasts' ? 'active' : ''}`}
            onClick={() => onPageChange('statistics-forecasts')}
          >
            └ Прогнозы
          </button>
        </>
      )}
      
      {isSectionVisible('ZAKUP') && (
        <>
          <button 
            className={`sidebar-nav-btn ${activePage === 'ZAKUP' ? 'active' : ''}`}
            onClick={() => onPageChange('ZAKUP')}
          >
            Закупки
          </button>
          <button
            className={`sidebar-sub-btn ${activePage === 'zakup-onm' ? 'active' : ''}`}
            onClick={() => onPageChange('zakup-onm')}
          >
            └ ОНМ
          </button>
          <button
            className={`sidebar-sub-btn ${activePage === 'zakup-pen' ? 'active' : ''}`}
            onClick={() => onPageChange('zakup-pen')}
          >
            └ ПЭН
          </button>
          <button 
            className={`sidebar-nav-btn ${activePage === 'zakup-spravochnik' ? 'active' : ''}`}
            onClick={() => onPageChange('zakup-spravochnik')}
          >
            Справочник
          </button>
        </>
      )}
      
      {isSectionVisible('dogovory') && (
        <button 
          className={`sidebar-nav-btn ${activePage === 'dogovory' ? 'active' : ''}`}
          onClick={() => onPageChange('dogovory')}
        >
          Договора
        </button>
      )}
      
      {isSectionVisible('options') && (
        <>
          <button 
            className={`sidebar-nav-btn ${activePage === 'options' ? 'active' : ''}`}
            onClick={() => onPageChange('options')}
          >
            Сотовая связь
          </button>
          <button
            className={`sidebar-sub-btn ${activePage === 'options-tariffs' ? 'active' : ''}`}
            onClick={() => onPageChange('options-tariffs')}
          >
            └ Тарифы
          </button>
        </>
      )}
      
      {isSectionVisible('map') && (
        <button 
          className={`sidebar-nav-btn ${activePage === 'map' ? 'active' : ''}`}
          onClick={() => onPageChange('map')}
        >
          Карта объектов
        </button>
      )}
      
      {isSectionVisible('help') && (
          <>
            <button 
              className={`sidebar-nav-btn ${activePage === 'help' ? 'active' : ''}`}
              onClick={() => onPageChange('help')}
            >
              Спутниковая связь
            </button>
            <button
              className={`sidebar-sub-btn ${activePage === 'help-iridium' ? 'active' : ''}`}
              onClick={() => onPageChange('help-iridium')}
            >
              └ Иридиум
            </button>
          </>
        )}

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
