import React from 'react';

const renderTable = (tableIdx: number) => (
  <div style={{ textAlign: 'center', marginBottom: 4 }}>
    <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 2 }}>
      Таблица {tableIdx + 1}
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0, fontSize: 11 }} key={tableIdx} border={1}>
      <tbody>
        {[...Array(6)].map((_, rowIdx) => (
          <tr key={rowIdx}>
            {[...Array(3)].map((_, colIdx) => (
              <td key={colIdx} style={{ padding: 2, textAlign: 'center' }}>
                {rowIdx + 1}-{colIdx + 1}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const HomePage: React.FC = () => (
  <div style={{ padding: 32 }}>
    <h2>Главная страница</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {[...Array(9)].map((_, idx) => (
        <div key={idx} style={{ background: '#f8f8f8', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 6 }}>
          {renderTable(idx)}
        </div>
      ))}
    </div>
  </div>
);

export default HomePage;
