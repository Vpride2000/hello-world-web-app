import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  getSuppliers,
  saveSuppliers,
  getCounterparties,
  saveCounterparties,
  getContractsDirectory,
  saveContractsDirectory,
  SupplierRow,
  CounterpartyRow,
  ContractDirectoryRow,
} from '../../../api';

interface TableData {
  [key: string]: string;
}

const ZakupSpravochnik: React.FC = () => {
  const { canAccess } = useAuth();
  const canEdit = canAccess('statistics', 'edit');

  const [suppliersData, setSuppliersData] = useState<SupplierRow[]>([]);
  const [counterpartiesData, setCounterpartiesData] = useState<CounterpartyRow[]>([]);
  const [contractsData, setContractsDirectoryData] = useState<ContractDirectoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditModeSuppliers, setIsEditModeSuppliers] = useState(false);
  const [isEditModeCounterparties, setIsEditModeCounterparties] = useState(false);
  const [isEditModeContracts, setIsEditModeContracts] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [suppliersRes, counterpartiesRes, contractsRes] = await Promise.all([
          getSuppliers(),
          getCounterparties(),
          getContractsDirectory(),
        ]);

        if (suppliersRes.success) {
          setSuppliersData(suppliersRes.rows);
        }
        if (counterpartiesRes.success) {
          setCounterpartiesData(counterpartiesRes.rows);
        }
        if (contractsRes.success) {
          setContractsDirectoryData(contractsRes.rows);
        }
      } catch (err) {
        console.warn('Ошибка загрузки справочников из API:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddRowSuppliers = () => {
    setSuppliersData([...suppliersData, { name: '', contact_info: '' }]);
  };

  const handleSaveSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await saveSuppliers(suppliersData);
      if (response.success) {
        setSuppliersData(response.rows);
        setIsEditModeSuppliers(false);
        alert('✅ Поставщики успешно сохранены!');
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

  const handleCellChangeSuppliers = (index: number, field: keyof SupplierRow, value: string) => {
    const newData = [...suppliersData];
    newData[index] = { ...newData[index], [field]: value };
    setSuppliersData(newData);
  };

  const handleAddRowCounterparties = () => {
    setCounterpartiesData([...counterpartiesData, { name: '', type: '' }]);
  };

  const handleSaveCounterparties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await saveCounterparties(counterpartiesData);
      if (response.success) {
        setCounterpartiesData(response.rows);
        setIsEditModeCounterparties(false);
        alert('✅ Контрагенты успешно сохранены!');
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

  const handleCellChangeCounterparties = (index: number, field: keyof CounterpartyRow, value: string) => {
    const newData = [...counterpartiesData];
    newData[index] = { ...newData[index], [field]: value };
    setCounterpartiesData(newData);
  };

  const handleAddRowContracts = () => {
    setContractsDirectoryData([...contractsData, { type: '', description: '' }]);
  };

  const handleSaveContracts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await saveContractsDirectory(contractsData);
      if (response.success) {
        setContractsDirectoryData(response.rows);
        setIsEditModeContracts(false);
        alert('✅ Договоры успешно сохранены!');
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

  const handleCellChangeContracts = (index: number, field: keyof ContractDirectoryRow, value: string) => {
    const newData = [...contractsData];
    newData[index] = { ...newData[index], [field]: value };
    setContractsDirectoryData(newData);
  };

  return (
    <>
      <h2>Справочники</h2>
      {error && <p className="error">Ошибка: {error}</p>}
      {loading && <p>Загрузка...</p>}

      <div className="spravochnik-grid">
        <div className="table-section">
          <h3>Справочник поставщиков</h3>
          <div className="table-container">
            <table className="spravochnik-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Контактная информация</th>
                </tr>
              </thead>
              <tbody>
                {suppliersData.map((row, index) => (
                  <tr key={index}>
                    <td>
                      {isEditModeSuppliers && canEdit ? (
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleCellChangeSuppliers(index, 'name', e.target.value)}
                        />
                      ) : (
                        row.name
                      )}
                    </td>
                    <td>
                      {isEditModeSuppliers && canEdit ? (
                        <input
                          type="text"
                          value={row.contact_info}
                          onChange={(e) => handleCellChangeSuppliers(index, 'contact_info', e.target.value)}
                        />
                      ) : (
                        row.contact_info
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-buttons">
            {canEdit ? (
              !isEditModeSuppliers ? (
                <button className="btn-edit" onClick={() => setIsEditModeSuppliers(true)}>Редактировать</button>
              ) : (
                <>
                  <button className="btn-add" onClick={handleAddRowSuppliers}>Добавить строку</button>
                  <button className="btn-save" onClick={handleSaveSuppliers}>Сохранить в БД</button>
                  <button className="btn-cancel" onClick={() => setIsEditModeSuppliers(false)}>Отмена</button>
                </>
              )
            ) : (
              <p className="access-denied">⚠️ У вас нет прав на редактирование этого раздела</p>
            )}
          </div>
        </div>

        <div className="table-section">
          <h3>Справочник контрагентов</h3>
          <div className="table-container">
            <table className="spravochnik-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Тип</th>
                </tr>
              </thead>
              <tbody>
                {counterpartiesData.map((row, index) => (
                  <tr key={index}>
                    <td>
                      {isEditModeCounterparties && canEdit ? (
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleCellChangeCounterparties(index, 'name', e.target.value)}
                        />
                      ) : (
                        row.name
                      )}
                    </td>
                    <td>
                      {isEditModeCounterparties && canEdit ? (
                        <input
                          type="text"
                          value={row.type}
                          onChange={(e) => handleCellChangeCounterparties(index, 'type', e.target.value)}
                        />
                      ) : (
                        row.type
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-buttons">
            {canEdit ? (
              !isEditModeCounterparties ? (
                <button className="btn-edit" onClick={() => setIsEditModeCounterparties(true)}>Редактировать</button>
              ) : (
                <>
                  <button className="btn-add" onClick={handleAddRowCounterparties}>Добавить строку</button>
                  <button className="btn-save" onClick={handleSaveCounterparties}>Сохранить в БД</button>
                  <button className="btn-cancel" onClick={() => setIsEditModeCounterparties(false)}>Отмена</button>
                </>
              )
            ) : (
              <p className="access-denied">⚠️ У вас нет прав на редактирование этого раздела</p>
            )}
          </div>
        </div>

        <div className="table-section">
          <h3>Справочник договоров</h3>
          <div className="table-container">
            <table className="spravochnik-table">
              <thead>
                <tr>
                  <th>Тип договора</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                {contractsData.map((row, index) => (
                  <tr key={index}>
                    <td>
                      {isEditModeContracts && canEdit ? (
                        <input
                          type="text"
                          value={row.type}
                          onChange={(e) => handleCellChangeContracts(index, 'type', e.target.value)}
                        />
                      ) : (
                        row.type
                      )}
                    </td>
                    <td>
                      {isEditModeContracts && canEdit ? (
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => handleCellChangeContracts(index, 'description', e.target.value)}
                        />
                      ) : (
                        row.description
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-buttons">
            {canEdit ? (
              !isEditModeContracts ? (
                <button className="btn-edit" onClick={() => setIsEditModeContracts(true)}>Редактировать</button>
              ) : (
                <>
                  <button className="btn-add" onClick={handleAddRowContracts}>Добавить строку</button>
                  <button className="btn-save" onClick={handleSaveContracts}>Сохранить в БД</button>
                  <button className="btn-cancel" onClick={() => setIsEditModeContracts(false)}>Отмена</button>
                </>
              )
            ) : (
              <p className="access-denied">⚠️ У вас нет прав на редактирование этого раздела</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ZakupSpravochnik;
