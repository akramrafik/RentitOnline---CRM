// components/LeadFilter.jsx
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import ReactSelect from '@/components/partials/froms/ReactSelect';
import Flatpickr from 'react-flatpickr';
import { getCategories } from '@/lib/api';

const sourceOptions = [
  { value: '', label: 'All' },
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const LeadFilter = ({selectedSource, setSelectedSource, selectedCategory, setSelectedCategory, dates, setDates}) => {
  const [categoryOptions, setCategoryOptions] = useState([]);

  const handleFilterChange = () => {
    const [startDate, endDate] = dates;
    onFilterChange({
      source: source !== 'all' ? source : '',
      category,
      start_date: startDate ? startDate.toISOString().split('T')[0] + ' 00:00' : '',
      end_date: endDate ? endDate.toISOString().split('T')[0] + ' 23:59' : '',
    });
  };
const handleDateChange = (dates) =>{
  setDates(dates);
  console.log(dates);
};
 const handleCategoryChange = (selectedOption) => {
  setSelectedCategory(selectedOption?.value);
  console.log('Selected source value:', selectedOption?.value);
};
const handleSourceChange = (option) => {
  setSelectedSource(option?.value);
  console.log('Selected source value:', option?.value);
};
  // const handleClear = () => {
  //   setSource('all');
  //   setCategory('');
  //   setDates([]);
  //   onFilterChange({});
  // };
useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await getCategories({ type: 'parent' });
        if (response.status === true && Array.isArray(response.data)) {
          const parents = response.data
            .filter(item => !item.parent && item.status)
            .map(cat => ({
              value: cat.id,
              label: cat.name,
            }));
            console.log('parents', parents);
          setCategoryOptions(parents);
        }
      } catch (err) {
        console.error('Error fetching parent categories', err);
      }
    };

    fetchParentCategories();
  }, []);

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <ReactSelect
            options = {sourceOptions}
            value = {selectedSource}
            onChange = {handleSourceChange}
            placeholder = "Select Source"
          />
        </div>
        <div>
          <ReactSelect
          options = {categoryOptions}
          onChange = {handleCategoryChange}
          value = {selectedCategory}
          placeholder = "Select Category"
          />
        </div>
        <div>
          <Flatpickr
            value={dates}
            onChange={handleDateChange}
            options={{ mode: 'range', dateFormat: 'Y-m-d' }}
            className="form-control py-2"
            placeholder="Select Date Range"
          />
        </div>
        {/* <div className="flex items-center">
          <button className="btn btn-dark" onClick={handleFilterChange}>
            Apply Filters
          </button>
          <button className="btn btn-light ml-2" onClick={handleClear}>
            Clear Filters
          </button>
        </div> */}
      </div>
    </Card>
  );
};

export default LeadFilter;
