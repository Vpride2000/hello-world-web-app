import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './DogovorPage.css';

interface DogovorData {
  [key: string]: string;
}

interface TableData {
  [rowIndex: number]: DogovorData;
}

const DogovorPage: React.FC = () => {
  const { currentUser } = useAuth();
  const canEdit = currentUser?.permissions.find(p => p.section === 'dogovory')?.level === 'edit' || currentUser?.role === 'АДМ';
  
  console.log('DogovorPage - currentUser:', currentUser);
  console.log('DogovorPage - canEdit:', canEdit);
  
  const DB_KEY = 'dogovory_table_data';
  const COUNTERPARTIES_KEY = 'spravochnikCounterparties';
  const [counterpartiesList, setCounterpartiesList] = useState<string[]>([]);

  const [tableData, setTableData] = useState<TableData>(() => {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultData();
      }
    }
    return getDefaultData();
  });

  function getDefaultData(): TableData {
    const data: TableData = {};
    for (let i = 0; i < 10; i++) {
      data[i] = {
        contract: '',
        counterparty: '',
        sum: '',
        status: '',
        date: '',
      };
    }
    return data;
  }

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(tableData));
  }, [tableData]);

  useEffect(() => {
    const loadCounterparties = () => {
      try {
        const stored = localStorage.getItem(COUNTERPARTIES_KEY);
        if (stored) {
          const list = JSON.parse(stored) as string[];
          setCounterpartiesList(list);
        }
      } catch (error) {
        console.error('Ошибка загрузки контрагентов:', error);
      }
    };

    loadCounterparties();

    const handleSpravochnikUpdate = () => {
      loadCounterparties();
    };

    window.addEventListener('spravochnik-updated', handleSpravochnikUpdate);
    return () => window.removeEventListener('spravochnik-updated', handleSpravochnikUpdate);
  }, []);

  const handleInputChange = (rowIndex: number, field: string, value: string) => {
    if (!canEdit) return;
    
    setTableData((prev) => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    alert('✅ Данные договоров сохранены');
  };

  if (!currentUser) {
    console.log('No currentUser');
    return <div className="page-content">Пожалуйста, авторизуйтесь</div>;
  }

  // Временно убрали проверку доступа для отладки
  console.log('Rendering table');
  console.log('Permissions:', currentUser.permissions);

  return (
    <>
      <h2>Статус договоров</h2>
      <p className="table-description">
        Таблица для отслеживания статуса и информации по договорам
      </p>

      {!canEdit && (
        <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
          📖 Вы в режиме чтения. Редактирование недоступно.
        </p>
      )}

      <div className="dogovory-wrapper">
        <table className="dogovory-table">
          <thead>
            <tr>
              <th>№ договора</th>
              <th>Контрагент</th>
              <th>Сумма (руб.)</th>
              <th>Статус</th>
              <th>Дата подписания</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <input
                    type="text"
                    value={tableData[rowIndex]?.contract || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'contract', e.target.value)}
                    disabled={!canEdit}
                    placeholder="№ договора"
                  />
                </td>
                <td>
                  <select
                    value={tableData[rowIndex]?.counterparty || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'counterparty', e.target.value)}
                    disabled={!canEdit}
                    className="counterparty-select"
                  >
                    <option value="">-- Выберите контрагента --</option>
                    {counterpartiesList.map((counterparty) => (
                      <option key={counterparty} value={counterparty}>
                        {counterparty}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={tableData[rowIndex]?.sum || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'sum', e.target.value)}
                    disabled={!canEdit}
                    placeholder="Сумма"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={tableData[rowIndex]?.status || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'status', e.target.value)}
                    disabled={!canEdit}
                    placeholder="Статус"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={tableData[rowIndex]?.date || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'date', e.target.value)}
                    disabled={!canEdit}
                    placeholder="Дата"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-group">
        <button
          className="btn-action btn-save"
          onClick={handleSave}
          disabled={!canEdit}
        >
          💾 Сохранить в БД
        </button>
      </div>
    </>
  );
};

export default DogovorPage;
