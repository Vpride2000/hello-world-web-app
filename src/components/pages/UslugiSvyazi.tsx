import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

interface TableData {
  [key: string]: string;
}

const UslugiSvyazi: React.FC = () => {
  const { canAccess } = useAuth();
  const [isEditMode, setIsEditMode] = useState<{[key: string]: boolean}>({
    adm: false,
    sggf: false,
    vggf: false,
    tggf: false,
    oggf: false,
    cggf: false,
  });

  // Данные для каждой таблицы
  const [admData, setAdmData] = useState<TableData[]>([
    { col0: 'Стационарная Телефония', col1: '100', col2: '200', col3: '150', col4: '120', col5: '180', col6: '90' },
    { col0: 'Внутризоновая связь', col1: '80', col2: '150', col3: '120', col4: '100', col5: '140', col6: '70' },
    { col0: 'Межгород', col1: '50', col2: '90', col3: '70', col4: '60', col5: '80', col6: '40' },
    { col0: 'Сотовая связь', col1: '200', col2: '300', col3: '250', col4: '220', col5: '280', col6: '150' },
    { col0: 'Спутниковая связь', col1: '30', col2: '50', col3: '40', col4: '35', col5: '45', col6: '25' },
  ]);

  const [sggfData, setSggfData] = useState<TableData[]>([
    { col0: 'Стационарная Телефония', col1: '120', col2: '220', col3: '170', col4: '140', col5: '200', col6: '110' },
    { col0: 'Внутризоновая связь', col1: '90', col2: '170', col3: '140', col4: '120', col5: '160', col6: '90' },
    { col0: 'Межгород', col1: '60', col2: '110', col3: '90', col4: '80', col5: '100', col6: '60' },
    { col0: 'Сотовая связь', col1: '220', col2: '320', col3: '270', col4: '240', col5: '300', col6: '170' },
    { col0: 'Спутниковая связь', col1: '40', col2: '60', col3: '50', col4: '45', col5: '55', col6: '35' },
  ]);

  const [vggfData, setVggfData] = useState<TableData[]>([
    { col0: 'Стационарная Телефония', col1: '110', col2: '210', col3: '160', col4: '130', col5: '190', col6: '100' },
    { col0: 'Внутризоновая связь', col1: '85', col2: '160', col3: '130', col4: '110', col5: '150', col6: '80' },
    { col0: 'Межгород', col1: '55', col2: '100', col3: '80', col4: '70', col5: '90', col6: '50' },
    { col0: 'Сотовая связь', col1: '210', col2: '310', col3: '260', col4: '230', col5: '290', col6: '160' },
    { col0: 'Спутниковая связь', col1: '35', col2: '55', col3: '45', col4: '40', col5: '50', col6: '30' },
  ]);

  const [tggfData, setTggfData] = useState<TableData[]>([
    { col0: 'Стационарная Телефония', col1: '95', col2: '195', col3: '145', col4: '115', col5: '175', col6: '85' },
    { col0: 'Внутризоновая связь', col1: '75', col2: '145', col3: '115', col4: '95', col5: '135', col6: '65' },
    { col0: 'Межгород', col1: '45', col2: '85', col3: '65', col4: '55', col5: '75', col6: '35' },
    { col0: 'Сотовая связь', col1: '195', col2: '295', col3: '245', col4: '215', col5: '275', col6: '145' },
    { col0: 'Спутниковая связь', col1: '25', col2: '45', col3: '35', col4: '30', col5: '40', col6: '20' },
  ]);

  const [oggfData, setOggfData] = useState<TableData[]>([
    { col0: 'Стационарная Телефония', col1: '105', col2: '205', col3: '155', col4: '125', col5: '185', col6: '95' },
    { col0: 'Внутризоновая связь', col1: '82', col2: '152', col3: '122', col4: '102', col5: '142', col6: '72' },
    { col0: 'Межгород', col1: '52', col2: '92', col3: '72', col4: '62', col5: '82', col6: '42' },
    { col0: 'Сотовая связь', col1: '205', col2: '305', col3: '255', col4: '225', col5: '285', col6: '155' },
    { col0: 'Спутниковая связь', col1: '32', col2: '52', col3: '42', col4: '37', col5: '47', col6: '27' },
  ]);

  const [cggfData, setCggfData] = useState<TableData[]>([
    { col0: 'Стационарная Телефония', col1: '115', col2: '215', col3: '165', col4: '135', col5: '195', col6: '105' },
    { col0: 'Внутризоновая связь', col1: '88', col2: '158', col3: '128', col4: '108', col5: '148', col6: '78' },
    { col0: 'Межгород', col1: '58', col2: '98', col3: '78', col4: '68', col5: '88', col6: '48' },
    { col0: 'Сотовая связь', col1: '215', col2: '315', col3: '265', col4: '235', col5: '295', col6: '165' },
    { col0: 'Спутниковая связь', col1: '38', col2: '58', col3: '48', col4: '43', col5: '53', col6: '33' },
  ]);

  const [originalData, setOriginalData] = useState<{[key: string]: TableData[]}>({});

  const canEdit = canAccess('statistics', 'edit');

  // Вычисление сводной таблицы
  const summaryData = useMemo(() => {
    const allTables = [admData, sggfData, vggfData, tggfData, oggfData, cggfData];
    return admData.map((_, rowIndex) => {
      const row: TableData = { col0: admData[rowIndex].col0 };
      for (let col = 1; col <= 6; col++) {
        const colKey = `col${col}`;
        const sum = allTables.reduce((acc, table) => {
          const value = parseFloat(table[rowIndex][colKey]) || 0;
          return acc + value;
        }, 0);
        row[colKey] = sum.toString();
      }
      return row;
    });
  }, [admData, sggfData, vggfData, tggfData, oggfData, cggfData]);

  const handleEdit = (tableName: string) => {
    const tableGetters: {[key: string]: TableData[]} = {
      adm: admData,
      sggf: sggfData,
      vggf: vggfData,
      tggf: tggfData,
      oggf: oggfData,
      cggf: cggfData,
    };
    setOriginalData({ ...originalData, [tableName]: [...tableGetters[tableName]] });
    setIsEditMode({ ...isEditMode, [tableName]: true });
  };

  const handleSave = (tableName: string) => {
    setIsEditMode({ ...isEditMode, [tableName]: false });
    alert('✅ Данные успешно сохранены!');
  };

  const handleCancel = (tableName: string) => {
    const tableSetters: {[key: string]: (data: TableData[]) => void} = {
      adm: setAdmData,
      sggf: setSggfData,
      vggf: setVggfData,
      tggf: setTggfData,
      oggf: setOggfData,
      cggf: setCggfData,
    };
    if (originalData[tableName]) {
      tableSetters[tableName]([...originalData[tableName]]);
    }
    setIsEditMode({ ...isEditMode, [tableName]: false });
  };

  const handleCellChange = (tableName: string, rowIndex: number, colKey: string, value: string) => {
    const tableGetters: {[key: string]: TableData[]} = {
      adm: admData,
      sggf: sggfData,
      vggf: vggfData,
      tggf: tggfData,
      oggf: oggfData,
      cggf: cggfData,
    };
    const tableSetters: {[key: string]: (data: TableData[]) => void} = {
      adm: setAdmData,
      sggf: setSggfData,
      vggf: setVggfData,
      tggf: setTggfData,
      oggf: setOggfData,
      cggf: setCggfData,
    };
    
    const newData = [...tableGetters[tableName]];
    newData[rowIndex][colKey] = value;
    tableSetters[tableName](newData);
  };

  const renderTable = (title: string, data: TableData[], tableName: string, isSummary: boolean = false) => {
    const editMode = isEditMode[tableName];
    
    return (
      <div className="table-section" key={tableName}>
        <h3>{title}</h3>
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
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(row).map((colKey) => (
                    <td key={colKey}>
                      {editMode && canEdit && !isSummary ? (
                        <input
                          type="text"
                          value={row[colKey]}
                          onChange={(e) => handleCellChange(tableName, rowIndex, colKey, e.target.value)}
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
        {!isSummary && (
          <div className="table-buttons">
            {canEdit ? (
              !editMode ? (
                <button className="btn-edit" onClick={() => handleEdit(tableName)}>Редактировать</button>
              ) : (
                <>
                  <button className="btn-save" onClick={() => handleSave(tableName)}>Сохранить</button>
                  <button className="btn-cancel" onClick={() => handleCancel(tableName)}>Отмена</button>
                </>
              )
            ) : (
              <p className="access-denied">⚠️ У вас нет прав на редактирование этого раздела</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <h2>Услуги связи</h2>
      
      {/* Сводная таблица */}
      <div className="summary-table">
        <h3>📊 Сводная таблица (суммы по всем филиалам)</h3>
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
              {summaryData.map((row, rowIndex) => (
                <tr key={rowIndex} className="summary-row">
                  {Object.keys(row).map((colKey) => (
                    <td key={colKey}>
                      <strong>{row[colKey]}</strong>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '2px solid #ddd' }} />

      {/* Детальные таблицы */}
      <h3>Детальные таблицы по филиалам</h3>
      {renderTable('Административный филиал (Адм)', admData, 'adm')}
      {renderTable('Северный газотранспортный филиал (СГГФ)', sggfData, 'sggf')}
      {renderTable('Восточный газотранспортный филиал (ВГГФ)', vggfData, 'vggf')}
      {renderTable('Тюменский газотранспортный филиал (ТГГФ)', tggfData, 'tggf')}
      {renderTable('Омский газотранспортный филиал (ОГГФ)', oggfData, 'oggf')}
      {renderTable('Центральный газотранспортный филиал (ЦГГФ)', cggfData, 'cggf')}
    </>
  );
};

export default UslugiSvyazi;
