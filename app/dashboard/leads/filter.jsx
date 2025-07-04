'use client';
import React, { useState, useEffect } from 'react';
import ReactSelectFilter from '@/components/partials/froms/ReactSelectFIlter';
import { getCategories } from '@/lib/api';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css'; // Optional: theme CSS
import Checkbox from '@/components/ui/Checkbox';

const sourceOptions = [
  { value: '', label: 'All' },
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const LeadFilter = ({
  selectedSource,
  setSelectedSource,
  selectedCategory,
  setSelectedCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  removeDuplicate,
  setRemoveDuplicate,
}) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParentCategories = async () => {
      setLoadingCategories(true);
      setError(null);
      try {
        const response = await getCategories({ type: 'parent' });
        console.log('getCategories response:', response);

        if (response.status === true && Array.isArray(response.data)) {
          const parents = response.data
            .filter(
              (item) =>
                (item.parent === null || item.parent === 0 || item.parent === undefined) &&
                item.status
            )
            .map((cat) => ({
              value: cat.id,
              label: cat.name,
            }));
          console.log('Filtered parent categories:', parents);
          setCategoryOptions(parents);
        } else {
          console.warn('Unexpected response data:', response);
          setCategoryOptions([]);
        }
      } catch (err) {
        console.error('Error fetching parent categories', err);
        setError('Failed to load categories');
        setCategoryOptions([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchParentCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div>
        <ReactSelectFilter
          options={sourceOptions}
          value={sourceOptions.find((opt) => opt.value === selectedSource)}
          onChange={(option) => setSelectedSource(option?.value)}
          placeholder="Select Source"
        />
      </div>

      <div>
        <ReactSelectFilter
          options={categoryOptions}
          value={categoryOptions.find((opt) => opt.value === selectedCategory)}
          onChange={(option) => setSelectedCategory(option?.value)}
          placeholder={
            loadingCategories ? 'Loading...' : 'Categories'
          }
          isDisabled={loadingCategories}
          noOptionsMessage={() =>
            loadingCategories
              ? 'Loading...'
              : error
              ? 'Error loading categories'
              : 'No categories found'
          }
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Flatpickr
          value={startDate}
          onChange={(date) => setStartDate(date[0])}
          options={{ dateFormat: 'Y-m-d' }}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Select start date"
          aria-label="Start date"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Flatpickr
          value={endDate}
          onChange={(date) => setEndDate(date[0])}
          options={{ dateFormat: 'Y-m-d' }}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Select end date"
          aria-label="End date"
        />
      </div>
      <Checkbox
  label="Remove Duplicate"
  value={removeDuplicate}  
  onChange={() => setRemoveDuplicate(!removeDuplicate)}
  id="removeDuplicateCheckbox"
/>
    </div>
  );
};

export default LeadFilter;