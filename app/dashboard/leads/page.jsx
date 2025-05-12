'use client'
import React, { useEffect, useState } from 'react';
import LeadTable from './table';
import LeadFilter from './filter';
import { getLeads } from '@/lib/api';

const LeadsPage = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = async (filterParams = {}) => {
    setLoading(true);
    try {
      const response = await getLeads(filterParams);
      const transformedData = response.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        source: item.source_type,
        date: new Date(item.date).toLocaleString(),
        //ad_link: `https://your-ads-website.com/ad/${item.ad_id}`,
      }));
      setData(transformedData);
    } catch (err) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };
  console.log(data);
  useEffect(() => {
    fetchLeads(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 space-y-4">
      <LeadFilter onFilterChange={handleFilterChange} />
      <LeadTable data={data} />
    </div>
  );
};

export default LeadsPage;
