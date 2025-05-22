// components/BulkActionsPopup.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const BulkActionsPopup = ({ isOpen, onClose, selectedItems = [], children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={clsx(
          "fixed bottom-16 right-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center gap-4",
          "transition-all duration-300",
          "w-auto max-w-full",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-500 hover:text-red-500"
          aria-label="Close popup"
        >
          ✕
        </button>
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Bulk Actions ({selectedItems.length} selected)
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

BulkActionsPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedItems: PropTypes.array,
  children: PropTypes.node.isRequired,
  className: PropTypes.string, // for layout-specific tweaks
};

export default BulkActionsPopup;
