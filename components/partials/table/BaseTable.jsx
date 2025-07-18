'use client';
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useRowSelect 
} from 'react-table';
import GlobalFilter from './GlobalFilter';
import TablePagination from '../TablePagination';

const SkeletonRow = ({ colSpan }) => (
  <tr>
    {[...Array(colSpan)].map((_, i) => (
      <td key={i} className="table-td whitespace-nowrap py-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4"></div>
      </td>
    ))}
  </tr>
);

const BaseTable = forwardRef(({
  title,
  columns,
  apiCall,
  params = {},
  pageSize = 10,
  renderRowActions,
  filter,
  setFilter,
  pageIndex,
  setPageIndex,
  showGlobalFilter = true,
  actionButton,
  onSelectionChange,
  refreshKey,
  rowSelect = true,
  hideTitle = false,
  hideGlobalFilter = false,
  hidePagination = false,
}, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiCall({ pageIndex, q: filter, ...params });
      setData(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refetch: fetchData
  }));

  useEffect(() => {
    fetchData();
  }, [filter, pageIndex, params, refreshKey]);

  const plugins = [
    useGlobalFilter,
    useSortBy,
    usePagination,
  ];
  if (rowSelect) plugins.push(useRowSelect);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
      manualPagination: true,
      pageCount: totalPages,
    },
    ...plugins,
    (hooks) => {
      if (rowSelect) {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <input type="checkbox" className="table-checkbox" {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <input type="checkbox" className="table-checkbox" {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ]);
      }
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    selectedFlatRows,
    state: { selectedRowIds },
    toggleAllRowsSelected,
  } = tableInstance;

  useEffect(() => {
    if (rowSelect && Object.keys(selectedRowIds).length > 0) {
      setShowPopup(true);
    }
  }, [selectedRowIds, rowSelect]);

  const handleClosePopup = () => {
    setShowPopup(false);
    toggleAllRowsSelected(false);
  };

  useEffect(() => {
    if (rowSelect && onSelectionChange) {
      const selectedData = selectedFlatRows.map((row) => row.original);
      onSelectionChange(selectedData);
    }
  }, [selectedRowIds, rowSelect]);

  return (
    <div className="">
      {/* ✅ Show header only if there is data */}
      {data.length > 0 && !(hideTitle && hideGlobalFilter) && (
        <div className="md:flex justify-between items-center mb-5">
          {!hideTitle && <h4 className="card-title">{title}</h4>}
          <div className="flex align-center">
            {actionButton}
            {!hideGlobalFilter && showGlobalFilter && (
              <GlobalFilter filter={filter} setFilter={setFilter} />
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="min-w-[100%] divide-y divide-slate-100 table-fixed dark:divide-slate-700" {...getTableProps()}>
          <thead className="bg-slate-200 dark:bg-slate-700">
            {loading ? (
              <SkeletonRow colSpan={columns.length + (renderRowActions ? 1 : 0) + (rowSelect ? 1 : 0)} />
            ) : (
              headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    const headerProps = column.getHeaderProps(column.getSortByToggleProps());
                    const { key, ...rest } = headerProps;
                    return (
                      <th
                        key={key}
                        {...rest}
                        className={`table-th whitespace-nowrap ${column.sticky === "left" ? "sticky left-0 z-10 bg-slate-200 dark:bg-slate-700 shadow-dropdown" : ""}`}
                      >
                        {column.render('Header')}
                        <span className="ml-1">
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    );
                  })}
                  {renderRowActions && <th className="px-4 py-2 border-b">Actions</th>}
                </tr>
              ))
            )}
          </thead>

          <tbody
            className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
            {...getTableBodyProps()}
          >
            {loading ? (
              [...Array(pageSize)].map((_, i) => (
                <SkeletonRow key={i} colSpan={columns.length + (renderRowActions ? 1 : 0) + (rowSelect ? 1 : 0)} />
              ))
            ) : page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      const cellProps = cell.getCellProps();
                      const { key, ...rest } = cellProps;
                      return (
                        <td
                          key={key}
                          {...rest}
                          className={`table-td whitespace-nowrap ${cell.column.sticky === "left" ? "sticky left-0 z-10 bg-white dark:bg-slate-800 shadow-dropdown" : ""}`}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                    {renderRowActions && (
                      <td className="px-4 py-2 border-b">
                        {renderRowActions(row.original)}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (renderRowActions ? 1 : 0) + (rowSelect ? 1 : 0)} className="text-center py-6">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Show pagination only if data exists */}
      {data.length > 0 && !hidePagination && (
        <div className="flex justify-between items-center pt-2">
          <div>Page {pageIndex + 1} of {totalPages}</div>
          <TablePagination
            currentPage={pageIndex}
            totalPages={totalPages}
            onPageChange={setPageIndex}
          />
        </div>
      )}
    </div>
  );
});

BaseTable.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.array.isRequired,
  apiCall: PropTypes.func.isRequired,
  params: PropTypes.object,
  pageSize: PropTypes.number,
  renderRowActions: PropTypes.func,
  filter: PropTypes.string,
  setFilter: PropTypes.func,
  pageIndex: PropTypes.number,
  setPageIndex: PropTypes.func,
  showGlobalFilter: PropTypes.bool,
  actionButton: PropTypes.node,
  onSelectionChange: PropTypes.func,
  refreshKey: PropTypes.any,
  rowSelect: PropTypes.bool,
  hideTitle: PropTypes.bool,
  hideGlobalFilter: PropTypes.bool,
  hidePagination: PropTypes.bool,
};

export default BaseTable;