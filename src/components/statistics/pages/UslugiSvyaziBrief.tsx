import React, { useState } from 'react';

type BriefRow = {
  id: string;
  service: string;
  y2024: string;
  y2025: string;
  y2026: string;
};

const UslugiSvyaziBrief: React.FC = () => {
  const [rows, setRows] = useState<BriefRow[]>([
    { id: 'svc-1', service: 'Стационарная телефония', y2024: '120', y2025: '125', y2026: '130' },
    { id: 'svc-2', service: 'Сотовая связь', y2024: '240', y2025: '260', y2026: '275' },
    { id: 'svc-3', service: 'Спутниковая связь', y2024: '45', y2025: '48', y2026: '52' },
    { id: 'svc-4', service: 'Интернет/каналы связи', y2024: '180', y2025: '190', y2026: '205' },
    { id: 'svc-5', service: 'Междугородняя связь', y2024: '60', y2025: '58', y2026: '62' },
  ]);

  const handleRowChange = (index: number, field: keyof BriefRow, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  return (
    <>
      <h2>Услуги связи — Кратко</h2>
      <div className="table-section">
        <h3>Кратко</h3>
        <p className="table-description">Сводные показатели по услугам связи за 3 года</p>
        <table className="brief-table">
          <thead>
            <tr>
              <th>Услуга связи</th>
              <th>2024</th>
              <th>2025</th>
              <th>2026</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="text"
                    value={row.service}
                    onChange={(e) => handleRowChange(index, 'service', e.target.value)}
                    className="cell-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.y2024}
                    onChange={(e) => handleRowChange(index, 'y2024', e.target.value)}
                    className="cell-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.y2025}
                    onChange={(e) => handleRowChange(index, 'y2025', e.target.value)}
                    className="cell-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.y2026}
                    onChange={(e) => handleRowChange(index, 'y2026', e.target.value)}
                    className="cell-input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UslugiSvyaziBrief;
