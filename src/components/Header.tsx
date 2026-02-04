import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-content">
        <img 
          className="company-logo" 
          src="https://yt3.googleusercontent.com/ytc/AIdro_nJBkQs-ezXCzsiOrwrltHYxUyTCVyuZKYcUBcJWMKyuQ=s900-c-k-c0x00ffffff-no-rj" 
          alt="Company Logo"
        />
        <h1>Отдел телекоммуникаций</h1>
      </div>
    </div>
  );
};

export default Header;
