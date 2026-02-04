import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import UslugiSvyazi from './pages/UslugiSvyazi';
import UslugiSvyaziUs741 from './pages/UslugiSvyaziUs741';
import ZakupPage from './pages/ZakupPage';
import ZakupOnm from './pages/ZakupOnm';
import ZakupPen from './pages/ZakupPen';
import ZakupSpravochnik from './pages/ZakupSpravochnik';
import OptionsPage from './pages/OptionsPage';
import MapPage from './pages/MapPage';
import HelpPage from './pages/HelpPage';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './LoginPage';
import { useAuth } from '../context/AuthContext';
import '../styles/style.css';

type PageId = 'statistics' | 'statistics-us741' | 'ZAKUP' | 'zakup-onm' | 'zakup-pen' | 'zakup-spravochnik' | 'options' | 'map' | 'help' | 'admin';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState<PageId>('statistics');

  const handlePageChange = (pageId: PageId) => {
    setActivePage(pageId);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="layout-container">
      <Header />
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />
      <div className="main-content">
        {activePage === 'statistics' && <UslugiSvyazi />}
        {activePage === 'statistics-us741' && <UslugiSvyaziUs741 />}
        {activePage === 'ZAKUP' && <ZakupPage />}
        {activePage === 'zakup-onm' && <ZakupOnm />}
        {activePage === 'zakup-pen' && <ZakupPen />}
        {activePage === 'zakup-spravochnik' && <ZakupSpravochnik />}
        {activePage === 'options' && <OptionsPage />}
        {activePage === 'map' && <MapPage />}
        {activePage === 'help' && <HelpPage />}
        {activePage === 'admin' && <AdminPanel />}
      </div>
    </div>
  );
};

export default App;
