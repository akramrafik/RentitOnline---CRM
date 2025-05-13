'use client';
import React, { useEffect, useState } from 'react';
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
import Button from '@/components/ui/Button';

const BaseTable = ({
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
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // it will run when the pageIndex changes
  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = {
        ...params,
        pageIndex,
        page: pageIndex + 1,
        pageSize,
        search: filter, 
      };
      const response = await apiCall(queryParams);
      setData(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when filter or pageIndex changes
  useEffect(() => {
    fetchData();
  }, [filter, pageIndex, params]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    selectedFlatRows,
    state: { selectedRowIds },
    toggleAllRowsSelected,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
      manualPagination: true,
      pageCount: totalPages,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <input type="checkbox" className="table-checkbox" {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <input type="checkbox"  className="table-checkbox" {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  return (
    <div className="space-y-4">
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">{title}</h4>
        {actionButton}
        {showGlobalFilter && (
          <GlobalFilter filter={filter} setFilter={setFilter} /> 
        )}
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-[100%] divide-y divide-slate-100 table-fixed dark:divide-slate-700" {...getTableProps()}>
          <thead className="bg-slate-200 dark:bg-slate-700">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                     className="table-th whitespace-nowrap"
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
                ))}
                {renderRowActions && <th className="px-4 py-2 border-b">Actions</th>}
              </tr>
            ))}
          </thead>

          <tbody
            className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
            {...getTableBodyProps()}
          >
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="table-td whitespace-nowrap py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td key={cell.column.id} {...cell.getCellProps()} className="table-td whitespace-nowrap">
                        {cell.render('Cell')}
                      </td>
                    ))}
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
                <td colSpan={columns.length + 1} className="text-center py-6">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div>Page {pageIndex + 1} of {totalPages}</div>
        <TablePagination
          currentPage={pageIndex}
          totalPages={totalPages}
          onPageChange={setPageIndex}
        />
      </div>
    </div>
  );
};

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
  actionButton: PropTypes.node,
};

export default BaseTable;
