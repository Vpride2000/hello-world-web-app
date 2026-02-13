import React, { useMemo, useState } from 'react';
import { DataGrid, Column, RenderEditCellProps } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

type BriefRow = {
  id: string;
  service: string;
  y2024: string;
  y2025: string;
  y2026: string;
};

const UslugiSvyaziBrief: React.FC = () => {
  const renderEditCell = (props: RenderEditCellProps<BriefRow>) => {
    return (
      <input
        className="rdg-text-editor"
        autoFocus
        value={props.row[props.column.key as keyof BriefRow] as string}
        onChange={(e) => props.onRowChange({ ...props.row, [props.column.key]: e.target.value })}
      />
    );
  };

  const columns: Column<BriefRow>[] = useMemo(
    () => [
      { key: 'service', name: 'Услуга связи', resizable: true, frozen: true, width: 260, renderEditCell },
      { key: 'y2024', name: '2024', width: 120, renderEditCell },
      { key: 'y2025', name: '2025', width: 120, renderEditCell },
      { key: 'y2026', name: '2026', width: 120, renderEditCell },
    ],
    []
  );

  const [rows, setRows] = useState<BriefRow[]>([
    { id: 'svc-1', service: 'Стационарная телефония', y2024: '120', y2025: '125', y2026: '130' },
    { id: 'svc-2', service: 'Сотовая связь', y2024: '240', y2025: '260', y2026: '275' },
    { id: 'svc-3', service: 'Спутниковая связь', y2024: '45', y2025: '48', y2026: '52' },
    { id: 'svc-4', service: 'Интернет/каналы связи', y2024: '180', y2025: '190', y2026: '205' },
    { id: 'svc-5', service: 'Междугородняя связь', y2024: '60', y2025: '58', y2026: '62' },
  ]);

  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(new Set());
  const rowKeyGetter = (row: BriefRow) => row.id;

  return (
    <>
      <h2>Услуги связи — Кратко</h2>
      <div className="table-section">
        <h3>Кратко (на базе react-data-grid)</h3>
        <p className="table-description">Сводные показатели по услугам связи за 3 года</p>
        <div style={{ height: 260 }}>
          <DataGrid
            className="rdg-brief-light"
            columns={columns}
            rows={rows}
            onRowsChange={setRows}
            rowKeyGetter={rowKeyGetter}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            defaultColumnOptions={{ sortable: true, resizable: true }}
            rowHeight={36}
            headerRowHeight={38}
          />
        </div>
      </div>
    </>
  );
};

export default UslugiSvyaziBrief;
