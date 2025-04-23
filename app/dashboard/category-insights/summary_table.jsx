'use client';

import React, { useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import Card from "@/components/ui/Card";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Pagination from "./pagination";

const SkeletonRow = ({ columnsCount }) => (
  <tr>
    {Array.from({ length: columnsCount }).map((_, i) => (
      <td key={i} className="px-4 py-2 border">
        <Skeleton height={14} />
      </td>
    ))}
  </tr>
);

const SkeletonHeader = ({ columnsCount }) => (
  <tr>
    {Array.from({ length: columnsCount }).map((_, i) => (
      <th key={i} className="px-4 py-2 border">
        <Skeleton height={16} width="70%" />
      </th>
    ))}
  </tr>
);

const LocationCountsTable = ({ types = [], locations = [], loading = false }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get('category') || '';
  const emirate = searchParams.get('emirate') || '';
  const currentLocation = searchParams.get('location') || '';
  console.log("categoryId", categoryId);
  console.log("emirate", emirate); 
  console.log("currentLocation", currentLocation);

  const handleCompare = () => {

    if (!categoryId || !emirate || !currentLocation) {
      toast.error("Please select a category, emirate, and location to compare.");
      return;
    }

    const currentPath = '/dashboard/category-insights/comparison';
    const queryParams = new URLSearchParams({
      category: categoryId,
      emirate,
      location: currentLocation,
    });

    router.push(`${currentPath}?${queryParams.toString()}`);
  };

  const columns = useMemo(() => {
    const staticCols = [
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Agent",
        accessor: "agent_name",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: "Vendors",
        accessor: "vendor_count",
        Cell: ({ value }) => value ?? 0,
      },
    ];

    const dynamicCols = types.map((type) => ({
      Header: type,
      accessor: type,
      Cell: ({ value }) => value ?? 0,
    }));

    const actionCol = {
      Header: "Action",
      id: "action",
      Cell: ({ row }) => (
        <button
          onClick={() => handleCompare(row.original)}
          className="btn btn inline-flex justify-center btn-primary btn-sm">
          Compare
        </button>
      ),
    };

    return [...staticCols, ...dynamicCols, actionCol];
  }, [types]);

  const data = useMemo(() => locations, [locations]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const isEmpty = !loading && rows.length === 0;

  return (
    <Card>
      <div className="mb-4 flex justify-between items-center">
        <h4 className="card-title">Location Counts</h4>
        <GlobalFilter filter={state.globalFilter} setFilter={setGlobalFilter} />
      </div>

      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-[1100px] divide-y divide-slate-100 table-fixed dark:divide-slate-700"
        >
          <thead className="bg-slate-200 dark:bg-slate-700">
            {loading ? (
              <SkeletonHeader columnsCount={columns.length} />
            ) : (
              headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="table-th whitespace-nowrap"
                      key={column.id}
                    >
                      {column.render("Header")}
                      <span className="ml-1">
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))
            )}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonRow key={idx} columnsCount={columns.length} />
              ))
            ) : isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="table-td text-center py-4">
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="table-td whitespace-nowrap"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination />
    </Card>
  );
};

export default LocationCountsTable;
