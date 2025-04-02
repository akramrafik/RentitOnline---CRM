"use client";

import React from "react";
import { useTable } from "react-table";

const TableComponent = () => {
    const data = React.useMemo(
        () => [
            { id: 1, name: "John Doe", email: "john@example.com", position: "Manager", department: "HR", dob: "1990-01-01", status: "Active" },
            { id: 2, name: "Jane Smith", email: "jane@example.com", position: "Developer", department: "IT", dob: "1992-05-15", status: "Inactive" },
            { id: 3, name: "Alice Brown", email: "alice@example.com", position: "Designer", department: "Marketing", dob: "1995-07-23", status: "Active" }
        ],
        []
    );

    const columns = React.useMemo(
        () => [
            { Header: "ID", accessor: "id" },
            { Header: "Name", accessor: "name" },
            { Header: "Email", accessor: "email" },
            { Header: "Position", accessor: "position" },
            { Header: "Department", accessor: "department" },
            { Header: "DOB", accessor: "dob" },
            { Header: "Status", accessor: "status" },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => alert(`Editing ${row.original.name}`)}>
                        Edit
                    </button>
                )
            }
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <div className="overflow-x-auto">
            <table {...getTableProps()} className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()} className="border p-2 text-left">
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="border">
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()} className="border p-2">
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;
