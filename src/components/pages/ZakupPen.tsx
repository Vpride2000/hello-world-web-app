import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface TableData {
  [key: string]: string;
}

const ZakupPen: React.FC = () => {
  const { canAccess } = useAuth();
  const canEdit = canAccess('statistics', 'edit');
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<TableData[] | null>(null);

  const [penData, setPenData] = useState<TableData[]>([
    { col0: 'Проектирование', col1: '120', col2: '210', col3: '165', col4: '145', col5: '185', col6: '95' },
    { col0: 'Экспертиза', col1: '90', col2: '160', col3: '125', col4: '110', col5: '145', col6: '75' },
    { col0: 'Надзор', col1: '70', col2: '125', col3: '95', col4: '85', col5: '110', col6: '60' },
    { col0: 'Обследование', col1: '55', col2: '95', col3: '75', col4: '65', col5: '85', col6: '45' },
    { col0: 'Лицензирование', col1: '35', col2: '60', col3: '48', col4: '42', col5: '55', col6: '30' },
  ]);

  const handleEdit = () => {
    setOriginalData([...penData]);
    setIsEditMode(true);
  };

  const handleSave = () => {
    setIsEditMode(false);
    alert('✅ Данные успешно сохранены!');
  };

  const handleCancel = () => {
    if (originalData) {
      setPenData([...originalData]);
    }
    setIsEditMode(false);
  };

  const handleCellChange = (rowIndex: number, colKey: string, value: string) => {
    const newData = [...penData];
    newData[rowIndex][colKey] = value;
    setPenData(newData);
  };

  return (
    <>
      <h2>Закупки ПЭН</h2>
      <div className="table-section">
        <h3>Проектно-экспертная направленность</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Статья бюджета</th>
                <th>Адм</th>
                <th>СГГФ</th>
                <th>ВГГФ</th>
                <th>ТГГФ</th>
                <th>ОГГФ</th>
                <th>ЦГГФ</th>
              </tr>
            </thead>
            <tbody>
              {penData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(row).map((colKey) => (
                    <td key={colKey}>
                      {isEditMode && canEdit ? (
                        <input
                          type="text"
                          value={row[colKey]}
                          onChange={(e) => handleCellChange(rowIndex, colKey, e.target.value)}
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

export default ZakupPen;
