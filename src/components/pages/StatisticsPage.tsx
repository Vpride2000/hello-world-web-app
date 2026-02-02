import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface TableData {
  [key: string]: string;
}

const StatisticsPage: React.FC = () => {
  const { canAccess } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [tableData, setTableData] = useState<TableData[]>([
    { col0: 'Стафионарная Телефония', col1: 'Внутризоновая связь', col2: 'Межгород', col3: 'Сотовая связь', col4: 'Данные 1.5', col5: 'Данные 1.6', col6: 'Данные 1.7' },
    { col0: 'Внутризоновая связь', col1: 'Данные 2.2', col2: 'Данные 2.3', col3: 'Данные 2.4', col4: 'Данные 2.5', col5: 'Данные 2.6', col6: 'Данные 2.7' },
    { col0: 'Межгород', col1: 'Данные 3.2', col2: 'Данные 3.3', col3: 'Данные 3.4', col4: 'Данные 3.5', col5: 'Данные 3.6', col6: 'Данные 3.7' },
    { col0: 'Сотовая связь', col1: 'Данные 4.2', col2: 'Данные 4.3', col3: 'Данные 4.4', col4: 'Данные 4.5', col5: 'Данные 4.6', col6: 'Данные 4.7' },
    { col0: 'Спутниковая связь', col1: 'Данные 5.2', col2: 'Данные 5.3', col3: 'Данные 5.4', col4: 'Данные 5.5', col5: 'Данные 5.6', col6: 'Данные 5.7' },
  ]);
  const [originalData, setOriginalData] = useState<TableData[]>([]);

  const canEdit = canAccess('statistics', 'edit');

  const handleEdit = () => {
    setOriginalData([...tableData]);
    setIsEditMode(true);
  };

  const handleSave = () => {
    setIsEditMode(false);
    alert('✅ Данные успешно сохранены!');
  };

  const handleCancel = () => {
    setTableData([...originalData]);
    setIsEditMode(false);
  };

  const handleCellChange = (rowIndex: number, colKey: string, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colKey] = value;
    setTableData(newData);
  };

  return (
    <>
      <h2>Услуги связи</h2>
      <div className="table-container">
        <table id="dataTable">
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
            {tableData.map((row, rowIndex) => (
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
      </>
  );
};

export default StatisticsPage;
