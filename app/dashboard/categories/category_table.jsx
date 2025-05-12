import React from "react";
import Button from "@/components/ui/Button";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
  useRowSelect,
} from "react-table";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import Card from "@/components/ui/Card";

// Dummy IndeterminateCheckbox component (create or import as needed)
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

const CategoryTable = () => {
  const data = React.useMemo(
    () => [
      {
        id: 1,
        name: "Electronics",
        parent: "None",
        description: "All electronic items",
        status: "Active",
      },
      {
        id: 2,
        name: "Laptops",
        parent: "Electronics",
        description: "Laptop category",
        status: "Inactive",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Parent", accessor: "parent" },
      { Header: "Description", accessor: "description" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button onClick={() => alert(`Edit ${row.original.id}`)}>Edit</button>
            <button onClick={() => alert(`Delete ${row.original.id}`)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  // Destructure necessary props from the tableInstance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter,
  } = tableInstance;

  return (
    <Card>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">Category Table</h4>
        <div className="flex items-center gap-4">
          <Button text="Add new" icon="heroicons-outline:plus" className="btn-dark" />
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table
          className="min-w-[1100px] divide-y divide-slate-100 table-fixed dark:divide-slate-700"
          {...getTableProps()}
        >
          <thead className="bg-slate-200 dark:bg-slate-700">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    key={column.id}
                    className="table-th whitespace-nowrap"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody
            className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
            {...getTableBodyProps()}
          >
            {rows.map((row) => {
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
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CategoryTable;
