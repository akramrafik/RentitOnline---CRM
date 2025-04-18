'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { getInsightCoparison } from "@/lib/agents_api";

const Comparison = () => {
  const router = useRouter();
  const [comparisonData, setComparisonData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [emiratesOption, setEmiratesOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      const data = await getInsightCoparison();

      if (data?.status && data.data) {
        const mappedCategories = data.data.categories.map(cat => ({
          value: cat.id,
          label: cat.name
        }));

        const mappedEmirates = data.data.emirates.map(em => ({
          value: em.id,
          label: em.name
        }));

        setCategoryOptions(mappedCategories);
        setEmiratesOptions(mappedEmirates);
      }

      setLoading(false);
    };

    fetchInsights();
  }, []);

  return (
    <div className="space-y-5">
      {/* ✅ Back button that keeps query and form state intact */}
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-slate-100 text-slate-800 border rounded hover:bg-slate-200"
      >
        ← Back
      </button>

      {/* Filters */}
      <Card>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ReactSelect options={categoryOptions} />
          <ReactSelect options={emiratesOption} />
          <ReactSelect />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendors
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisonData?.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2">{item.location}</td>
                <td className="px-4 py-2">{item.agent}</td>
                <td className="px-4 py-2">{item.vendors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Comparison;
