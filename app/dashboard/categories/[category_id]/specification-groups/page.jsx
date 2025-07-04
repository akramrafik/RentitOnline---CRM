'use client';
import React, {
  useState,
  useMemo,
  useTransition,
  useEffect,
  useCallback
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import BaseTable from '@/components/partials/table/BaseTable';
import { getSpecificationGroupById, deleteSpecificationGroup, changeSpecificationGroupStatus } from '@/lib/api';
import Switch from '@/components/ui/Switch';
import Tooltip from '@/components/ui/Tooltip';
import { Icon } from '@iconify/react';
import ConfirmDialog from '@/components/partials/ConfirmPopup';
import CreateSpecGroup from './create_spec_group';
import Modal from '@/components/ui/Modal';
import EditSpecGroup from './edit_spec_group';
import Button from '@/components/ui/Button';

const SpecificationGroupsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { category_id } = useParams();
  const router = useRouter();

  const [filter, setFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [, startTransition] = useTransition();

  // Shared states for row actions
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);


  // Debounced filter setter
  const debouncedSetFilter = useMemo(
    () =>
      debounce((val) => {
        startTransition(() => {
          setFilter(val);
          setPageIndex(0);
        });
      }, 300),
    []
  );

  const handleFilterChange = useCallback((value) => {
    debouncedSetFilter(value);
  }, [debouncedSetFilter]);

  useEffect(() => {
    return () => debouncedSetFilter.cancel();
  }, [debouncedSetFilter]);

  const fetchSpecificationGroups = useCallback(
    async ({ pageIndex, q }) => {
      try {
        const data = await getSpecificationGroupById(category_id);
        const filteredData = q
          ? data.filter((item) =>
              item.name.toLowerCase().includes(q.toLowerCase())
            )
          : data;

        return {
          data: filteredData,
          meta: { last_page: 1 }
        };
      } catch (err) {
        console.error('Failed to fetch specification groups', err);
        return { data: [], meta: { last_page: 1 } };
      }
    },
    [category_id]
  );

  // Action handler
  useEffect(() => {
    if (!selectedItem || !actionType) return;

    if (actionType === 'edit') {
      setEditModalOpen(true);
    } else if (actionType === 'specification') {
      router.push(`/dashboard/categories/${category_id}/specification-groups/${selectedItem.id}`);
    } else if (actionType === 'delete') {
      setIsConfirmOpen(true);
    }

    // Reset action state after navigation or modal open
    setActionType(null);
  }, [selectedItem, actionType, router]);

  // Toggle switch status
  const StatusCell = React.memo(({ row }) => {
    const [status, setStatus] = useState(Boolean(Number(row.original.status)));
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
  setLoading(true);
  try {
    const response = await changeSpecificationGroupStatus(category_id, row.original.id);
    if (response.status) {
      setStatus(Boolean(Number(response.data.status)));
      toast.success('Status updated successfully');
    } else {
      toast.error('Failed to update status');
    }
  } catch (error) {
    console.error('Error toggling status:', error);
    toast.error('Error updating status');
  } finally {
    setLoading(false);
  }
};

    return (
      <Switch
        value={status}
        onChange={handleToggle}
        badge
        disabled={loading}
        prevIcon="heroicons-outline:check"
        nextIcon="heroicons-outline:x"
        activeClass="bg-primary-500"
      />
    );
  });

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Status', accessor: 'status', Cell: StatusCell },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ row }) => {
        const handleAction = (type) => {
          setSelectedItem(row.original);
          setActionType(type);
        };

        return (
          <div className="flex gap-2">
            <Tooltip content="Edit">
              <button className="action-btn" onClick={() => handleAction('edit')}>
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>

            <Tooltip content="Delete">
              <button className="action-btn" onClick={() => handleAction('delete')}>
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>

            <Tooltip content="Specification">
              <button className="action-btn" onClick={() => handleAction('specification')}>
                <Icon icon="heroicons:document-text" />
              </button>
            </Tooltip>
          </div>
        );
      }
    }
  ], []);

  return (
    <>
      <Card>
        <BaseTable
          title="Specification Groups"
          columns={columns}
          apiCall={fetchSpecificationGroups}
          params={{ category_id, refreshKey }}
          filter={filter}
          setFilter={handleFilterChange}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          showGlobalFilter={true}
          rowSelect={false}
          actionButton={
            <div className="space-xy-5 flex mr-1">
            <Button
  icon="heroicons-outline:plus"
  text="Add New"
  className="bg-primary-500 text-white btn-sm h-10 my-0"
  onClick={() => setCreateModalOpen(true)}
/>

              </div>
          }
        />
      </Card>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={async () => {
  try {
    await deleteSpecificationGroup(category_id, selectedItem.id);
    toast.success('Specification group deleted successfully');
    setRefreshKey(prev => prev + 1);
  } catch (err) {
    toast.error('Failed to delete specification group');
  } finally {
    setIsConfirmOpen(false);
    setSelectedItem(null);
  }
}}
        title="Delete Specification Group"
        message={`Are you sure you want to delete "${selectedItem?.name}"?`}
      />
      <Modal
  title="Edit"
  activeModal={editModalOpen}
  footerContent={null}
  onClose={() => {
  setEditModalOpen(false);
  setSelectedItem(null);
}}

>
  <EditSpecGroup
    data={selectedItem}
    categoryId={category_id}
    onClose={() => {
      setEditModalOpen(false);
      setRefreshKey(prev => prev + 1);
    }}
  />
</Modal>

<Modal
  title="Add Specification Group"
  activeModal={createModalOpen}
  footerContent={null}
  onClose={() => setCreateModalOpen(false)}
>
  <CreateSpecGroup
    categoryId={category_id}
    onClose={() => {
      setCreateModalOpen(false);
      setRefreshKey(prev => prev + 1);
    }}
  />
</Modal>


    </>
  );
};

export default SpecificationGroupsPage;