'use client';

import React, { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { getBannersById, deleteBannerById } from '@/lib/api'; // make sure deleteBannerById exists
import Card from '@/components/ui/Card';
import BaseTable from '@/components/partials/table/BaseTable';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/partials/ConfirmPopup';

// Helper to build image URL
const imageURL = (img) => process.env.NEXT_PUBLIC_IMAGE_BASE_URL + img;

const BannerListPage = () => {
  const { banner_type_id } = useParams();
  const [filter, setFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

 const fetchBanners = useCallback(
  async ({ pageIndex, filter }) => {
    const response = await getBannersById(banner_type_id);
    let data = response.data || [];
    if (filter) {
      data = data.filter(item =>
        item.name?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return {
      data,
      meta: {
        last_page: 1,
      },
    };
  },
  [banner_type_id]
);


  const handleEditClick = (row) => {
    setEditTarget(row);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setDeleteTarget(row);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBannerById(deleteTarget.id);
      toast.success('Banner deleted successfully');
      setDeleteTarget(null);
      setRefreshKey((prev) => prev + 1); 
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  return (
    <>
      <Card >
        <BaseTable
        title={`Banners of Type #${banner_type_id}`}
          apiCall={fetchBanners}
          params={{ pageIndex, filter, refreshKey }}
          columns={[
            { Header: 'ID', accessor: 'id' },
            {
              Header: 'Image',
              accessor: 'image',
              Cell: ({ value }) => (
                <img src={imageURL(value)} alt="banner" className="w-20 h-10 object-cover" />
              ),
            },
            {
              Header: 'Status',
              accessor: 'status',
              Cell: ({ value }) => (value ? 'Active' : 'Inactive'),
            },
            {
              Header: 'Action',
              accessor: 'actions',
              Cell: ({ row }) => (
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(row.original)}>✏️</button>
                  <button onClick={() => handleDeleteClick(row.original)}>🗑️</button>
                </div>
              ),
            },
          ]}
           filter={filter}
  setFilter={setFilter}
  pageIndex={pageIndex}
  setPageIndex={setPageIndex}
  refreshKey={refreshKey}
        />
      </Card>

      <Modal
        activeModal={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        footerContent={null}
      >
        {/* Uncomment and implement your EditBanner component */}
        {/* <EditBanner
          banner_id={editTarget?.id}
          onSuccess={() => {
            setEditModalOpen(false);
            setRefreshKey((prev) => prev + 1);
          }}
        /> */}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Banner"
        message={`Are you sure you want to delete banner ID #${deleteTarget?.id}?`}
      />
    </>
  );
};

export default BannerListPage;