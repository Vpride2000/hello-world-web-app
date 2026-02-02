import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import StatisticsPage from './pages/StatisticsPage';
import ZakupPage from './pages/ZakupPage';
import OptionsPage from './pages/OptionsPage';
import MapPage from './pages/MapPage';
import HelpPage from './pages/HelpPage';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './LoginPage';
import { useAuth } from '../context/AuthContext';
import '../styles/style.css';

type PageId = 'statistics' | 'ZAKUP' | 'options' | 'map' | 'help' | 'admin';

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
        {activePage === 'statistics' && <StatisticsPage />}
        {activePage === 'ZAKUP' && <ZakupPage />}
        {activePage === 'options' && <OptionsPage />}
        {activePage === 'map' && <MapPage />}
        {activePage === 'help' && <HelpPage />}
        {activePage === 'admin' && <AdminPanel />}
      </div>
    </div>
  );
};

export default App;
