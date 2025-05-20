"use client";
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
const DOTS = "..."

const getPaginationRange = (currentPage, totalPages, siblingCount = 1) => {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 2);

  const showLeftDots = leftSiblingIndex > 1;
  const showRightDots = rightSiblingIndex < totalPages - 2;

  const range = [];

  range.push(0); // First page

  if (showLeftDots) {
    range.push(DOTS);
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    range.push(i);
  }

  if (showRightDots) {
    range.push(DOTS);
  }

  range.push(totalPages - 1); // Last page

  return range;
};

const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  //const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
  const paginationRange = getPaginationRange(currentPage, totalPages);

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

      {paginationRange.map((page, index) =>
        page === DOTS ? (
          <span key={index} className="px-2 text-slate-400 select-none">
            &hellip;
          </span>
        ) : (
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
        )
      )}

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
