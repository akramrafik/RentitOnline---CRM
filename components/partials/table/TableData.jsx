import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);
const handleAddNew = () => {
  if (title === "Rio Agents") {
    console.log("Open Rio Agents Popup");
  } else if (title === "Agent Leads") {
    console.log("Open Agent Leads Popup");
  }
};
const TableData = ({ title , columns = [], data = [] }) => {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  if (!data.length) {
    return <p>Loading or No Data Available...</p>;
  }

  const tableInstance = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      const skipCheckboxFor = ["Recent Customer OTPs"];
      if (!skipCheckboxFor.includes(title)) {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
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
    rows,
    setGlobalFilter,
    prepareRow,
    state: { globalFilter }, 
  } = tableInstance;

  
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      const path = window.location.href.split("/").pop(); // Extract the last part of the URL
      if (path === "rio-agents") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, []);
  return (
    <Card>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">{title}</h4>
        <div className="flex items-center gap-4">
        {isVisible && (
          <>
        <Button
            onClick={handleAddNew}
            text="Add new"
            icon="heroicons-outline:plus"
            className="btn-dark"
          />
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </>
        )}
        </div>
      </div>
      <div className="overflow-x-auto w-full">
      <table className="min-w-[1100px] divide-y divide-slate-100 table-fixed dark:divide-slate-700" {...getTableProps()}>
        <thead className="bg-slate-200 dark:bg-slate-700">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="table-th whitespace-nowrap">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="table-td whitespace-nowrap">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </Card>
  );
};

export default TableData;
