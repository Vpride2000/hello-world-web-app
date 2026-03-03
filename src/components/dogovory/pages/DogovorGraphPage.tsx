import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './DogovorGraphPage.css';

const DogovorGraphPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [periodStart, setPeriodStart] = useState('2022-12');
  const [periodEnd, setPeriodEnd] = useState('2023-06');
  const [displayedPeriodStart, setDisplayedPeriodStart] = useState('2022-12');
  const [displayedPeriodEnd, setDisplayedPeriodEnd] = useState('2023-06');

  if (!currentUser) {
    return <div className="page-content">Пожалуйста, авторизуйтесь</div>;
  }

  // примерные данные, в реальном приложении их можно загрузить с сервера
  const contractData = [
    { name: 'Договор №1', start: '2022-12', end: '2023-06', overdueMonths: ['2023-03'] },
    { name: 'Договор №2', start: '2023-01', end: '2023-04', overdueMonths: [] },
    { name: 'Договор подряд №3', start: '2022-10', end: '2023-02', overdueMonths: ['2023-02'] },
    { name: 'АО «Пример» /22', start: '2023-02', end: '2023-06', overdueMonths: ['2023-05'] },
  ];

  const handleApplyPeriod = () => {
    setDisplayedPeriodStart(periodStart);
    setDisplayedPeriodEnd(periodEnd);
  };

  // генерируем список месяцев для шапки
  function getMonths(from: string, to: string) {
    const res: string[] = [];
    let [y, m] = from.split('-').map(Number);
    const [ty, tm] = to.split('-').map(Number);
    while (y < ty || (y === ty && m <= tm)) {
      res.push(`${y}-${m.toString().padStart(2, '0')}`);
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
    return res;
  }

  const months = getMonths(displayedPeriodStart, displayedPeriodEnd);

  return (
    <>
      <h2>График договоров</h2>
      <div className="graph-controls">
        <div>
          <label>
            Выберите период: &nbsp;
            <input 
              type="month" 
              value={periodStart} 
              onChange={(e) => setPeriodStart(e.target.value)} 
            /> 
            &ndash; 
            <input 
              type="month" 
              value={periodEnd} 
              onChange={(e) => setPeriodEnd(e.target.value)} 
            />
            <button onClick={handleApplyPeriod} className="apply-btn">Применить</button>
          </label>
        </div>
        <div className="legend">
          <span className="legend-item active">
            <span className="marker" /> действующий договор
          </span>
          <span className="legend-item ending">
            <span className="marker" /> срок заканчивается
          </span>
          <span className="legend-item overdue">
            <span className="marker" /> заявка вне срока
          </span>
        </div>
      </div>

      <table className="graph-table">
        <thead>
          <tr>
            <th className="first-column">Заказчик / Договор / Объект</th>
            {months.map(m => {
              const date = new Date(m + '-01');
              const label = date.toLocaleString('ru', { month: 'short', year: '2-digit' });
              return <th key={m}>{label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {contractData.map(item => (
            <tr key={item.name}>
              <td className="first-column">{item.name}</td>
              {months.map(m => {
                const active = m >= item.start && m <= item.end;
                const overdue = item.overdueMonths.includes(m);
                const isEnd = m === item.end;
                const classes = [];
                if (active) classes.push('cell-active');
                if (isEnd) classes.push('cell-end');
                return (
                  <td key={m} className={classes.join(' ')}>
                    {overdue ? <span className="overdue-marker">🚩</span> : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default DogovorGraphPage;
