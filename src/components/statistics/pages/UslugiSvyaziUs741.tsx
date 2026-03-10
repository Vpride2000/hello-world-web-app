import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import './UslugiSvyaziUs741.css';

const UslugiSvyaziUs741: React.FC = () => {
  const { canAccess } = useAuth();

  return (
    <>
      <h2>Услуги связи УС741</h2>
      <div className="table-section budget-planner">
        <p className="table-description">Ежемесячное планирование расходов по услугам связи</p>
        <p>Функциональность таблицы временно недоступна. ReactGrid был удален из проекта.</p>
      </div>
    </>
  );
};

export default UslugiSvyaziUs741;
