import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import UslugiSvyazi from './statistics/pages/UslugiSvyazi';
import UslugiSvyaziBrief from './statistics/pages/UslugiSvyaziBrief';
import UslugiSvyaziUs741 from './statistics/pages/UslugiSvyaziUs741';
import ForecastsPage from './statistics/pages/ForecastsPage';
import ZakupPage from './zakup/pages/ZakupPage';
import ZakupOnm from './zakup/pages/ZakupOnm';
import ZakupPen from './zakup/pages/ZakupPen';
import ZakupSpravochnik from './zakup/pages/ZakupSpravochnik';
import OptionsPage from './options/pages/OptionsPage';
import TariffsPage from './options/pages/TariffsPage';
import MapPage from './map/pages/MapPage';
import HelpPage from './help/pages/HelpPage';
import IridiumPage from './help/pages/IridiumPage';
import DogovorPage from './dogovory/pages/DogovorPage';
import AdminPanel from './admin/pages/AdminPanel';
import LoginPage from './LoginPage';
import { useAuth } from '../context/AuthContext';
import '../styles/style.css';
import HomePage from './HomePage';

type PageId = 'home' | 'statistics' | 'statistics-brief' | 'statistics-us741' | 'statistics-forecasts' | 'ZAKUP' | 'zakup-onm' | 'zakup-pen' | 'zakup-spravochnik' | 'dogovory' | 'options' | 'options-tariffs' | 'map' | 'help' | 'help-iridium' | 'admin';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState<PageId>('home');

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
        {activePage === 'home' && <HomePage />}
        {activePage === 'statistics' && <UslugiSvyazi />}
        {activePage === 'statistics-brief' && <UslugiSvyaziBrief />}
        {activePage === 'statistics-us741' && <UslugiSvyaziUs741 />}
        {activePage === 'statistics-forecasts' && <ForecastsPage />}
        {activePage === 'ZAKUP' && <ZakupPage />}
        {activePage === 'zakup-onm' && <ZakupOnm />}
        {activePage === 'zakup-pen' && <ZakupPen />}
        {activePage === 'zakup-spravochnik' && <ZakupSpravochnik />}
        {activePage === 'dogovory' && <DogovorPage />}
        {activePage === 'options' && <OptionsPage />}
        {activePage === 'options-tariffs' && <TariffsPage />}
        {activePage === 'map' && <MapPage />}
        {activePage === 'help' && <HelpPage />}
        {activePage === 'help-iridium' && <IridiumPage />}
        {activePage === 'admin' && <AdminPanel />}
      </div>
    </div>
  );
};

export default App;
