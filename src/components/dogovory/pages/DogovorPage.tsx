import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getDogovory, saveDogovory, DogovoryRow } from '../../../api';
import './DogovorPage.css';

const DEFAULT_ROW_COUNT = 10;

const DogovorPage: React.FC = () => {
  const { currentUser } = useAuth();
  const canEdit = currentUser?.permissions.find(p => p.section === 'dogovory')?.level === 'edit' || currentUser?.role === 'АДМ';

  const DB_KEY = 'dogovory_table_data';
  const COUNTERPARTIES_KEY = 'spravochnikCounterparties';
  const [counterpartiesList, setCounterpartiesList] = useState<string[]>([]);
  const [tableData, setTableData] = useState<DogovoryRow[]>(getDefaultData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getDefaultData(): DogovoryRow[] {
    return Array.from({ length: DEFAULT_ROW_COUNT }, () => ({
      contract: '',
      counterparty: '',
      sum: '',
      status: '',
      date: '',
    }));
  }

  const tableDataToRows = (data: DogovoryRow[]): DogovoryRow[] =>
    data.map((row) => ({
      contract: row.contract ?? '',
      counterparty: row.counterparty ?? '',
      sum: row.sum ?? '',
      status: row.status ?? '',
      date: row.date ?? '',
    }));

  const rowsToTableData = (rows: DogovoryRow[]): DogovoryRow[] => {
    const normalized = getDefaultData();
    rows.forEach((row, idx) => {
      normalized[idx] = {
        contract: row.contract ?? '',
        counterparty: row.counterparty ?? '',
        sum: row.sum ?? '',
        status: row.status ?? '',
        date: row.date ?? '',
      };
    });
    return normalized;
  };

  const addRow = () => {
    setTableData((prev) => [...prev, { contract: '', counterparty: '', sum: '', status: '', date: '' }]);
  };

  const removeRow = (index: number) => {
    setTableData((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleInputChange = (rowIndex: number, field: keyof DogovoryRow, value: string) => {
    if (!canEdit) return;

    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [field]: value } : row
      )
    );
  };

  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const saved = localStorage.getItem(DB_KEY);
        if (!saved) return;

        const parsed = JSON.parse(saved);
        // Франкенштейн-данные могут быть объектом (ранний формат), поэтому приводим к массиву
        if (Array.isArray(parsed)) {
          setTableData(parsed);
        } else if (parsed && typeof parsed === 'object') {
          setTableData(rowsToTableData(Object.values(parsed) as DogovoryRow[]));
        } else {
          setTableData(getDefaultData());
        }
      } catch (error) {
        console.warn('Ошибка чтения локального хранилища договоров:', error);
      }
    };

    const loadFromServer = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getDogovory();
        if (response.success && response.rows.length > 0) {
          setTableData(rowsToTableData(response.rows));
          localStorage.setItem(DB_KEY, JSON.stringify(rowsToTableData(response.rows)));
        } else {
          loadFromLocalStorage();
        }
      } catch (err) {
        console.warn('Ошибка загрузки договоров из API:', err);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    loadFromServer();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(COUNTERPARTIES_KEY);
    if (stored) {
      try {
        setCounterpartiesList(JSON.parse(stored));
      } catch (error) {
        console.error('Ошибка загрузки контрагентов:', error);
      }
    }

    const handleSpravochnikUpdate = () => {
      const updatedStored = localStorage.getItem(COUNTERPARTIES_KEY);
      if (updatedStored) {
        try {
          setCounterpartiesList(JSON.parse(updatedStored));
        } catch (error) {
          console.error('Ошибка загрузки контрагентов:', error);
        }
      }
    };

    window.addEventListener('spravochnik-updated', handleSpravochnikUpdate);
    return () => window.removeEventListener('spravochnik-updated', handleSpravochnikUpdate);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await saveDogovory(tableDataToRows(tableData));
      if (response.success) {
        const updated = rowsToTableData(response.rows);
        setTableData(updated);
        localStorage.setItem(DB_KEY, JSON.stringify(updated));
        alert('✅ Данные договоров сохранены');
      } else {
        throw new Error('API вернул неуспешный ответ');
      }
    } catch (err) {
      setError((err as Error).message);
      alert(`Ошибка при сохранении: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
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
              <th />
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <input
                    type="text"
                    value={row.contract || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'contract', e.target.value)}
                    disabled={!canEdit}
                    placeholder="№ договора"
                  />
                </td>
                <td>
                  <select
                    value={row.counterparty || ''}
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
                    value={row.sum || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'sum', e.target.value)}
                    disabled={!canEdit}
                    placeholder="Сумма"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.status || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'status', e.target.value)}
                    disabled={!canEdit}
                    placeholder="Статус"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.date || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'date', e.target.value)}
                    disabled={!canEdit}
                    placeholder="Дата"
                  />
                </td>
                <td>
                  <button
                    className="btn-action btn-delete"
                    type="button"
                    onClick={() => removeRow(rowIndex)}
                    disabled={!canEdit}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-group">
        <button
          className="btn-action btn-add"
          type="button"
          onClick={addRow}
          disabled={!canEdit}
        >
          ➕ Добавить строку
        </button>

        <button
          className="btn-action btn-save"
          onClick={handleSave}
          disabled={!canEdit || loading}
        >
          {loading ? 'Сохранение...' : '💾 Сохранить в БД'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: 12 }}>
          Ошибка: {error}
        </div>
      )}
    </>
  );
};

export default DogovorPage;
