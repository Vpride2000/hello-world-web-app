import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-content">
        <svg className="company-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#0066CC" stroke="#003399" strokeWidth="2"/>
          <text x="50" y="55" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">Г</text>
        </svg>
        <h1>Отдел телекоммуникаций</h1>
      </div>
    </div>
  );
};

export default Header;
