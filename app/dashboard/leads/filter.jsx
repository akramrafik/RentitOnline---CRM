// components/LeadFilter.jsx
import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import ReactSelect from '@/components/partials/froms/ReactSelect';
import Flatpickr from 'react-flatpickr';

const sourceOptions = [
  { value: 'all', label: 'All' },
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const categoryOptions = [
  { value: '1', label: 'Category 1' },
  { value: '2', label: 'Category 2' },
  // Add more categories as needed
];

const LeadFilter = ({ onFilterChange }) => {
  const [source, setSource] = useState('all');
  const [category, setCategory] = useState('');
  const [dates, setDates] = useState([]);

  const handleFilterChange = () => {
    const [startDate, endDate] = dates;
    onFilterChange({
      source: source !== 'all' ? source : '',
      category,
      start_date: startDate ? startDate.toISOString().split('T')[0] + ' 00:00' : '',
      end_date: endDate ? endDate.toISOString().split('T')[0] + ' 23:59' : '',
    });
  };

  const handleClear = () => {
    setSource('all');
    setCategory('');
    setDates([]);
    onFilterChange({});
  };

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <div>
          <ReactSelect
            options={sourceOptions}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Select Source"
          />
        </div>
        <div>
          <ReactSelect
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select Category"
          />
        </div>
        <div>
          <Flatpickr
            value={dates}
            onChange={setDates}
            options={{ mode: 'range', dateFormat: 'Y-m-d' }}
            className="form-control py-2"
            placeholder="Select Date Range"
          />
        </div>
        <div className="flex items-center">
          <button className="btn btn-dark" onClick={handleFilterChange}>
            Apply Filters
          </button>
          <button className="btn btn-light ml-2" onClick={handleClear}>
            Clear Filters
          </button>
        </div>
      </div>
    </Card>
  );
};

export default LeadFilter;
