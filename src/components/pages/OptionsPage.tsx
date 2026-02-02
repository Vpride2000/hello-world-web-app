import React from 'react';

const OptionsPage: React.FC = () => {
  return (
     <>
      <h2>Опции и настройки</h2>
      <div className="info-grid">
        <div className="info-card">
          <h3>Общие параметры</h3>
          <p>Настройка основных параметров приложения, включая язык, тему оформления и часовой пояс.</p>
        </div>
      </div>
      </>
  );
};

export default OptionsPage;
