import React from 'react';

const Header: React.FC = () => {
  const appName = process.env.REACT_APP_NAME || 'Отдел телекоммуникаций';
  const logoUrl = process.env.REACT_APP_COMPANY_LOGO_URL || '';

  return (
    <div className="header" style={{ justifyContent: 'flex-start' }}>
      <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <img 
          className="company-logo" 
          src={logoUrl}
          alt="Company Logo"
          style={{ marginRight: '16px' }}
        />
        <h1 style={{ margin: 0 }}>{appName}</h1>
      </div>
    </div>
  );
};

export default Header;
