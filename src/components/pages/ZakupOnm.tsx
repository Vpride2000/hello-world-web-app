import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface TableData {
  [key: string]: string;
}

const ZakupOnm: React.FC = () => {
  const { canAccess } = useAuth();
  const STORAGE_KEY = 'spravochnikSuppliers';
  const canEdit = canAccess('statistics', 'edit');
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<TableData[] | null>(null);
  const [suppliers, setSuppliers] = useState<string[]>([]);

  const [onmData, setOnmData] = useState<TableData[]>([
    { col0: 'Оборудование', col1: '150', col2: '250', col3: '200', col4: '180', col5: '220', col6: '120' },
    { col0: 'Материалы', col1: '100', col2: '180', col3: '150', col4: '130', col5: '170', col6: '90' },
    { col0: 'Техника', col1: '80', col2: '140', col3: '110', col4: '95', col5: '130', col6: '70' },
    { col0: 'Запчасти', col1: '60', col2: '110', col3: '85', col4: '75', col5: '100', col6: '55' },
    { col0: 'Инструменты', col1: '40', col2: '70', col3: '55', col4: '50', col5: '65', col6: '35' },
  ]);

  const loadSuppliers = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const list = JSON.parse(stored) as string[];
        if (Array.isArray(list)) {
          setSuppliers(list);
          return;
        }
      } catch {
        // ignore invalid storage
      }
    }
    setSuppliers([]);
  };

  useEffect(() => {
    loadSuppliers();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === STORAGE_KEY) {
        loadSuppliers();
      }
    };

    const handleCustomUpdate = () => {
      loadSuppliers();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('spravochnik-updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('spravochnik-updated', handleCustomUpdate);
    };
  }, []);

  const handleEdit = () => {
    setOriginalData([...onmData]);
    setIsEditMode(true);
  };

  const handleSave = () => {
    setIsEditMode(false);
    alert('✅ Данные успешно сохранены!');
  };

  const handleCancel = () => {
    if (originalData) {
      setOnmData([...originalData]);
    }
    setIsEditMode(false);
  };

  const handleCellChange = (rowIndex: number, colKey: string, value: string) => {
    const newData = [...onmData];
    newData[rowIndex][colKey] = value;
    setOnmData(newData);
  };

  return (
    <>
      <h2>Закупки ОНМ</h2>
      <div className="table-section">
        <h3>Основные направления материалов</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Номенклатура</th>
                <th>Тех. характеристики</th>
                <th>кол-во</th>
                <th>стоимость за 1 шт, без НДС</th>
                <th>подразделение</th>
                <th>адрес доставки</th>
                <th>описание</th>
              </tr>
            </thead>
            <tbody>
              {onmData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(row).map((colKey) => (
                    <td key={colKey}>
                      {isEditMode && canEdit ? (
                        colKey === 'col1' ? (
                          <select
                            value={row[colKey]}
                            onChange={(e) => handleCellChange(rowIndex, colKey, e.target.value)}
                          >
                            <option value="">— выберите —</option>
                            {suppliers.map((supplier) => (
                              <option key={supplier} value={supplier}>
                                {supplier}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={row[colKey]}
                            onChange={(e) => handleCellChange(rowIndex, colKey, e.target.value)}
                          />
                        )
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
      </div>
    </>
  );
};

export default ZakupOnm;
