'use client';

import React from "react";

const LocationCountsTable = ({ types = [], locations = [] }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-slate-300 bg-white shadow-md rounded-md overflow-hidden text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">Agent</th>
            <th className="px-4 py-2 border">Vendors</th>
            {types.map((type) => (
              <th key={type} className="px-4 py-2 border text-nowrap">
                {type}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {locations.length === 0 ? (
            <tr>
              <td colSpan={types.length + 3} className="text-center py-4 text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            locations.map((loc, index) => (
              <tr key={index} className="even:bg-slate-50">
                <td className="px-4 py-2 border">{loc.location}</td>
                <td className="px-4 py-2 border">{loc.agent_name || '—'}</td>
                <td className="px-4 py-2 border">{loc.vendor_count ?? 0}</td>
                {types.map((type) => (
                  <td key={type} className="px-4 py-2 border text-center">
                    {loc[type] ?? 0}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LocationCountsTable;
