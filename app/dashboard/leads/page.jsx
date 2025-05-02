'use client';
import React, { useEffect, useState } from 'react';
import LeadTable from './table';
import LeadFilter from './filter';
import { getLeads } from '@/lib/api';

const LeadsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const transformedData = data.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    source: item.source_type,
    date: new Date(item.date).toLocaleString(), // Optional formatting
    ad_link: `https://your-ads-website.com/ad/${item.ad_id}`, // Adjust this base URL as needed
  }));
  
  useEffect(() => {
    const fetchLeads = async () => {
        try {
          const response = await getLeads();
          setData(response?.data || []);
        } catch (err) {
          setError('Failed to load leads');
        } finally {
          setLoading(false);
        }
      };
      console.log(setData);
    fetchLeads();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return(
    <div className="p-4 space-y-4">
    <LeadFilter/>
  <LeadTable data={transformedData} />
  </div>
);
};

export default LeadsPage;
