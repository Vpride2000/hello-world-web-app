import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactGrid, Column, Row, CellChange, TextCell } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';
import './UslugiSvyaziUs741.css';

interface GridData {
  rows: string[][];
}

const UslugiSvyaziUs741: React.FC = () => {
  const { canAccess } = useAuth();
  const canEdit = canAccess('statistics', 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const DB_KEY = 'us741_grid_data';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Создаем колонки с более красивым форматом
  const columns: Column[] = [
    { columnId: 'col0', width: 180 },
    { columnId: 'col1', width: 120 },
    { columnId: 'col2', width: 120 },
    { columnId: 'col3', width: 120 },
    { columnId: 'col4', width: 120 },
    { columnId: 'col5', width: 120 },
    { columnId: 'col6', width: 120 },
    { columnId: 'col7', width: 120 },
    { columnId: 'col8', width: 120 },
    { columnId: 'col9', width: 120 },
    { columnId: 'col10', width: 120 },
  ];

  // Создаем начальные данные (20 строк x 11 столбцов)
  const [rows, setRows] = useState<Row[]>(() => {
    const headerRow: Row = {
      rowId: 'header',
      cells: [
        { type: 'header', text: 'Описание' },
        { type: 'header', text: 'Янв' },
        { type: 'header', text: 'Фев' },
        { type: 'header', text: 'Мар' },
        { type: 'header', text: 'Апр' },
        { type: 'header', text: 'Май' },
        { type: 'header', text: 'Июн' },
        { type: 'header', text: 'Июл' },
        { type: 'header', text: 'Авг' },
        { type: 'header', text: 'Сен' },
        { type: 'header', text: 'Итого' },
      ],
    };

    const dataRows: Row[] = Array.from({ length: 20 }, (_, rowIdx) => ({
      rowId: `row${rowIdx}`,
      cells: [
        { type: 'text', text: '' } as TextCell,
        ...Array.from({ length: 10 }, () => ({ type: 'text', text: '' } as TextCell)),
      ],
    }));

    return [headerRow, ...dataRows];
  });

  // Функция расчета суммы по строке
  const calculateRowTotal = (rowCells: any[]): string => {
    let sum = 0;
    for (let i = 1; i < 10; i++) {
      const value = parseFloat(rowCells[i]?.text || '0');
      if (!isNaN(value)) sum += value;
    }
    return sum > 0 ? sum.toString() : '';
  };

  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(DB_KEY);
      if (savedData) {
        const parsedData: GridData = JSON.parse(savedData);
        if (parsedData.rows && parsedData.rows.length > 0) {
          const loadedRows = parsedData.rows.map((rowData: string[], index: number) => {
            const cells = [
              { type: 'text', text: rowData[0] || '' } as TextCell,
              ...rowData.slice(1, 10).map((text: string) => ({
                type: 'text',
                text: text || '',
              } as TextCell)),
              { type: 'text', text: '', disabled: true } as any,
            ];
            return {
              rowId: `row${index}`,
              cells,
            };
          });
          setRows((prevRows) => [prevRows[0], ...loadedRows.slice(0, 20)]);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }, []);

  const handleChanges = useCallback((changes: CellChange[]) => {
    if (!canEdit) return;

    setRows((prevRows) => {
      const newRows = [...prevRows];
      changes.forEach((change) => {
        const rowIndex = newRows.findIndex((row) => row.rowId === change.rowId);
        if (rowIndex !== -1 && rowIndex !== 0) {
          const row = newRows[rowIndex];
          const columnIndex = columns.findIndex((col) => col.columnId === change.columnId);

          if (columnIndex !== -1) {
            row.cells[columnIndex] = change.newCell;
          }

          // Пересчитываем итого в последней колонке
          const totalCell: any = { type: 'text', text: calculateRowTotal(row.cells), disabled: true };
          if (row.cells[11]) {
            row.cells[11] = totalCell;
          }
        }
      });
      return newRows;
    });
  }, [canEdit, columns]);

  const handleSaveToDatabase = () => {
    if (!canEdit) {
      alert('⚠️ У вас нет прав на редактирование');
      return;
    }

    setIsSaving(true);

    try {
      // Преобразуем данные для сохранения (пропускаем заголовок и итого)
      const dataToSave = rows.slice(1).map((row) =>
        row.cells.slice(0, 10).map((cell: any) => (cell.text ? cell.text : ''))
      );

      const dbData: GridData = {
        rows: dataToSave,
      };

      // Сохраняем в localStorage
      localStorage.setItem(DB_KEY, JSON.stringify(dbData));

      setIsSaving(false);
      alert('✅ Данные успешно сохранены в базу данных!');
    } catch (error) {
      setIsSaving(false);
      console.error('Ошибка при сохранении:', error);
      alert('❌ Ошибка при сохранении данных');
    }
  };

  const handleExportToXLSX = () => {
    try {
      const headerData = [['Описание', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Итого']];
      const tableData = rows.slice(1).map((row) =>
        row.cells.map((cell: any) => cell.text || '')
      );

      const wsData = [...headerData, ...tableData];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'УС741');

      XLSX.writeFile(wb, 'UslugiSvyaziUs741.xlsx');
      alert('✅ Данные успешно выгружены в файл!');
    } catch (error) {
      console.error('Ошибка при выгрузке:', error);
      alert('❌ Ошибка при выгрузке данных');
    }
  };

  const handleExportToXLSXWithPath = async () => {
    try {
      if (!('showDirectoryPicker' in window)) {
        alert('⚠️ Ваш браузер не поддерживает выбор папок. Используйте Chrome, Edge или другой Chromium-based браузер.');
        return;
      }

      const dirHandle = await (window as any).showDirectoryPicker();

      const headerData = [['Описание', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Итого']];
      const tableData = rows.slice(1).map((row) =>
        row.cells.map((cell: any) => cell.text || '')
      );

      const wsData = [...headerData, ...tableData];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'УС741');

      const fileHandle = await dirHandle.getFileHandle('UslugiSvyaziUs741.xlsx', { create: true });
      const writable = await fileHandle.createWritable();

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      await writable.write(new Blob([wbout], { type: 'application/octet-stream' }));
      await writable.close();

      alert('✅ Данные успешно выгружены в выбранную папку!');
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Ошибка при выгрузке:', error);
        alert('❌ Ошибка при выгрузке данных');
      }
    }
  };

  const handleImportFromXLSX = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) {
      alert('⚠️ У вас нет прав на редактирование');
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const binaryStr = e.target?.result as string;
        const wb = XLSX.read(binaryStr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (data && data.length > 1) {
          const importedRows = data.slice(1).slice(0, 20).map((rowData: any[], index: number) => ({
            rowId: `row${index}`,
            cells: [
              { type: 'text', text: rowData[0] ? String(rowData[0]) : '' } as TextCell,
              ...rowData.slice(1, 10).map((cellValue: any) => ({
                type: 'text',
                text: cellValue ? String(cellValue) : '',
              } as TextCell)),
              { type: 'text', text: '', disabled: true } as any,
            ],
          }));

          while (importedRows.length < 20) {
            importedRows.push({
              rowId: `row${importedRows.length}`,
              cells: [
                { type: 'text', text: '' } as TextCell,
                ...Array.from({ length: 10 }, () => ({ type: 'text', text: '' } as TextCell)),
              ],
            });
          }

          setRows((prevRows) => [prevRows[0], ...importedRows]);
          alert('✅ Данные успешно загружены из файла!');
        }
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        alert('❌ Ошибка при загрузке файла');
      }
    };

    reader.readAsBinaryString(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <h2>Услуги связи УС741</h2>
      <div className="table-section budget-planner">
        <p className="table-description">Ежемесячное планирование расходов по услугам связи</p>
        <div style={{ width: '100%', height: '600px', overflow: 'auto' }} className="grid-wrapper">
          <ReactGrid
            rows={rows}
            columns={columns}
            onCellsChanged={handleChanges}
            enableRangeSelection
            enableRowSelection={canEdit}
            enableColumnSelection={false}
          />
        </div>

        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {canEdit ? (
            <>
              <button
                onClick={handleSaveToDatabase}
                disabled={isSaving}
                className="btn-action btn-save"
              >
                {isSaving ? '⏳ Сохранение...' : '💾 Сохранить в БД'}
              </button>
              <button
                onClick={handleExportToXLSX}
                className="btn-action btn-export"
              >
                📥 Выгрузить в XLSX
              </button>
              <button
                onClick={handleExportToXLSXWithPath}
                className="btn-action btn-export-path"
              >
                📂 Выгрузить в папку
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-action btn-import"
              >
                📤 Загрузить из XLSX
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFromXLSX}
                style={{ display: 'none' }}
              />
            </>
          ) : (
            <p className="access-denied">⚠️ У вас нет прав на редактирование этого раздела</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UslugiSvyaziUs741;
