import React from 'react';
import Pagination from './pagination';
import SkeletonLoader from './loader';
import { useTheme } from '../../contexts/ThemeContext';

const DataTable = ({ 
  columns, 
  data, 
  currentPage, 
  totalPages,
  onPageChange,
  itemsPerPage,
  isLoading
}) => {
  const { currentTheme } = useTheme();

  // Theme-based colors
  const tableBg = currentTheme.background?.paper || '#fff';
  const headerBg = currentTheme.background?.default || '#f3f4f6';
  const headerText = currentTheme.text?.secondary || '#6b7280';
  const rowBg = currentTheme.background?.paper || '#fff';
  const rowDivider = currentTheme.divider || '#e5e7eb';

  if (isLoading) {
    return (
      <div
        className="container mx-auto rounded-lg shadow-md overflow-hidden"
        style={{ background: tableBg }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full" style={{ background: tableBg }}>
            <thead style={{ background: headerBg }}>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: headerText, borderBottom: `1px solid ${rowDivider}` }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                      <SkeletonLoader type="table-row" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto rounded-lg shadow-md overflow-hidden"
      style={{ background: tableBg }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full" style={{ background: tableBg }}>
          <thead style={{ background: headerBg }}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: headerText, borderBottom: `1px solid ${rowDivider}` }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center"
                  style={{ color: currentTheme.text?.secondary }}
                >
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    background: rowBg,
                    borderBottom: `1px solid ${rowDivider}`
                  }}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default DataTable;
