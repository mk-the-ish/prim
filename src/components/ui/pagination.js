import React from 'react';
import Button from './button';
import { useTheme } from '../../contexts/ThemeContext';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const { currentTheme } = useTheme();
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className="flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4"
      style={{
        background: currentTheme.background?.default,
        color: currentTheme.text?.secondary
      }}
    >
      <div className="text-sm mb-2 md:mb-0">
        Showing {indexOfFirstItem} to {indexOfLastItem} of {totalItems} entries
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          variant="secondary"
        >
          First
        </Button>
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          variant="secondary"
        >
          Previous
        </Button>
        <span
          className="px-3 py-1 border rounded text-sm"
          style={{
            background: currentTheme.background?.paper,
            color: currentTheme.text?.primary,
            borderColor: currentTheme.divider
          }}
        >
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          Next
        </Button>
        <Button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          Last
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
