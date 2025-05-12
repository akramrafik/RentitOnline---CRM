"use client";
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page); // Ensure the new page index is within the valid range
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handlePageChange(0)}
        disabled={isFirst}
        aria-label="Go to first page"
        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
      >
        &laquo;
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Go to previous page"
        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
      >
        &lsaquo;
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={clsx(
            "w-8 h-8 rounded-full border flex items-center justify-center",
            page === currentPage
              ? "bg-blue-600 text-white shadow"
              : "text-slate-700 hover:bg-gray-100"
          )}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Go to next page"
        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
      >
        &rsaquo;
      </button>
      <button
        onClick={() => handlePageChange(totalPages - 1)}
        disabled={isLast}
        aria-label="Go to last page"
        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
      >
        &raquo;
      </button>
    </div>
  );
};

TablePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default TablePagination;
