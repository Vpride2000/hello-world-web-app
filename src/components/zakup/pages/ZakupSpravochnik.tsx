import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

interface TableData {
  [key: string]: string;
}

const ZakupSpravochnik: React.FC = () => {
  const { canAccess } = useAuth();
  const STORAGE_KEY = process.env.REACT_APP_STORAGE_KEY_SUPPLIERS || 'spravochnikSuppliers';
  const COUNTERPARTIES_KEY = process.env.REACT_APP_STORAGE_KEY_COUNTERPARTIES || 'spravochnikCounterparties';
  const CONTRACTS_KEY = process.env.REACT_APP_STORAGE_KEY_CONTRACTS || 'spravochnikContracts';
  const DEFAULT_SUPPLIERS = ['Поставщик А', 'Поставщик Б', 'Поставщик В', 'Поставщик Г', 'Поставщик Д'];
  const DEFAULT_COUNTERPARTIES = ['Контрагент 1', 'Контрагент 2', 'Контрагент 3', 'Контрагент 4', 'Контрагент 5'];
  const DEFAULT_CONTRACTS = ['Договор 001', 'Договор 002', 'Договор 003', 'Договор 004', 'Договор 005'];
  const canEdit = canAccess('statistics', 'edit');
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<{
    suppliers: TableData[];
    counterparties: TableData[];
    contracts: TableData[];
  } | null>(null);

  const [spravochnikData, setSpravochnikData] = useState<TableData[]>(
    DEFAULT_SUPPLIERS.map((name) => ({ col0: name }))
  );
  const [counterpartiesData, setCounterpartiesData] = useState<TableData[]>(
    DEFAULT_COUNTERPARTIES.map((name) => ({ col0: name }))
  );
  const [contractsData, setContractsData] = useState<TableData[]>(
    DEFAULT_CONTRACTS.map((name) => ({ col0: name }))
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const list = JSON.parse(stored) as string[];
        if (Array.isArray(list)) {
          setSpravochnikData(list.map((name) => ({ col0: name })));
        }
      } catch {
        // ignore invalid storage
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SUPPLIERS));
    }

    const storedCounterparties = localStorage.getItem(COUNTERPARTIES_KEY);
    if (storedCounterparties) {
      try {
        const list = JSON.parse(storedCounterparties) as string[];
        if (Array.isArray(list)) {
          setCounterpartiesData(list.map((name) => ({ col0: name })));
        }
      } catch {
        // ignore invalid storage
      }
    } else {
      localStorage.setItem(COUNTERPARTIES_KEY, JSON.stringify(DEFAULT_COUNTERPARTIES));
    }

    const storedContracts = localStorage.getItem(CONTRACTS_KEY);
    if (storedContracts) {
      try {
        const list = JSON.parse(storedContracts) as string[];
        if (Array.isArray(list)) {
          setContractsData(list.map((name) => ({ col0: name })));
        }
      } catch {
        // ignore invalid storage
      }
    } else {
      localStorage.setItem(CONTRACTS_KEY, JSON.stringify(DEFAULT_CONTRACTS));
    }
  }, []);

  const handleEdit = () => {
    setOriginalData({
      suppliers: [...spravochnikData],
      counterparties: [...counterpartiesData],
      contracts: [...contractsData],
    });
    setIsEditMode(true);
  };

  const handleSave = () => {
    setIsEditMode(false);
    const suppliers = spravochnikData
      .map((row) => row.col0?.trim())
      .filter((name) => Boolean(name)) as string[];
    const counterparties = counterpartiesData
      .map((row) => row.col0?.trim())
      .filter((name) => Boolean(name)) as string[];
    const contracts = contractsData
      .map((row) => row.col0?.trim())
      .filter((name) => Boolean(name)) as string[];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
    localStorage.setItem(COUNTERPARTIES_KEY, JSON.stringify(counterparties));
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
    
    window.dispatchEvent(new Event('spravochnik-updated'));
    alert('✅ Данные успешно сохранены!');
  };

  const handleCancel = () => {
    if (originalData) {
      setSpravochnikData([...originalData.suppliers]);
      setCounterpartiesData([...originalData.counterparties]);
      setContractsData([...originalData.contracts]);
    }
    setIsEditMode(false);
  };

  const handleCellChange = (
    tableName: 'suppliers' | 'counterparties' | 'contracts',
    rowIndex: number,
    colKey: string,
    value: string
  ) => {
    const tableGetters: { [key: string]: TableData[] } = {
      suppliers: spravochnikData,
      counterparties: counterpartiesData,
      contracts: contractsData,
    };
    const tableSetters: { [key: string]: (data: TableData[]) => void } = {
      suppliers: setSpravochnikData,
      counterparties: setCounterpartiesData,
      contracts: setContractsData,
    };

    const newData = [...tableGetters[tableName]];
    newData[rowIndex][colKey] = value;
    tableSetters[tableName](newData);
  };

  return (
    <>
      <h2>Справочник закупок</h2>
      <div className="spravochnik-grid">
        <div className="table-section table-section-narrow">
          <h3>Справочник поставщиков</h3>
          <div className="table-container">
            <table className="spravochnik-table">
              <thead>
                <tr>
                  <th>Поставщик</th>
                </tr>
              </thead>
              <tbody>
                {spravochnikData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((colKey) => (
                      <td key={colKey}>
                        {isEditMode && canEdit ? (
                          <input
                            type="text"
                            value={row[colKey]}
                            onChange={(e) => handleCellChange('suppliers', rowIndex, colKey, e.target.value)}
                          />
                        ) : (
                          row[colKey]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-section table-section-narrow">
          <h3>Справочник контрагентов</h3>
          <div className="table-container">
            <table className="spravochnik-table">
              <thead>
                <tr>
                  <th>Контрагент</th>
                </tr>
              </thead>
              <tbody>
                {counterpartiesData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((colKey) => (
                      <td key={colKey}>
                        {isEditMode && canEdit ? (
                          <input
                            type="text"
                            value={row[colKey]}
                            onChange={(e) => handleCellChange('counterparties', rowIndex, colKey, e.target.value)}
                          />
                        ) : (
                          row[colKey]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-section table-section-narrow">
          <h3>Справочник договоров</h3>
          <div className="table-container">
            <table className="spravochnik-table">
              <thead>
                <tr>
                  <th>Договор</th>
                </tr>
              </thead>
              <tbody>
                {contractsData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((colKey) => (
                      <td key={colKey}>
                        {isEditMode && canEdit ? (
                          <input
                            type="text"
                            value={row[colKey]}
                            onChange={(e) => handleCellChange('contracts', rowIndex, colKey, e.target.value)}
                          />
                        ) : (
                          row[colKey]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="table-buttons">
        {canEdit ? (
          !isEditMode ? (
            <button className="btn-edit" onClick={handleEdit}>Редактировать</button>
          ) : (
            <>
              <button className="btn-save" onClick={handleSave}>Сохранить</button>
              <button className="btn-cancel" onClick={handleCancel}>Отмена</button>
            </>
          )
        ) : (
          <p className="access-denied">⚠️ У вас нет прав на редактирование этого раздела</p>
        )}
      </div>
    </>
  );
};

export default ZakupSpravochnik;
