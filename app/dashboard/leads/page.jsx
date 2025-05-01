'use client';
import React, { useEffect, useState } from 'react';
import LeadTable from './table';
import { getLeads } from '@/lib/api';

const LeadsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      

    fetchLeads();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return <LeadTable data={data} />;
};

export default LeadsPage;
