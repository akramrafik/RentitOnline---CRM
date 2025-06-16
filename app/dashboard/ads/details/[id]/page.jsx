'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { getAdById } from '@/lib/api';
import ImageSlider from './ImageSlider';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const statusMap = {
  'Under review': 'bg-orange-100 text-orange-800',
  'Active': 'bg-green-100 text-green-800',
  'In Draft': 'bg-gray-600 text-white',
  'Payment Pending': 'bg-amber-100 text-amber-800',
  'Rejected': 'bg-red-100 text-red-800',
  'DLD Failed': 'bg-pink-100 text-pink-800',
  'Expired': 'bg-slate-100 text-slate-800',
};

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [data, setData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchAd = useCallback(async () => {
    try {
      const response = await getAdById({ ad_id: id });
      const ad = response?.data?.data;
      setData(ad);
      setImages(ad?.images || []);
    } catch (error) {
      console.error('Error fetching ad details:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchAd();
  }, [fetchAd, id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 w-full">
      {/* Left Column */}
      <div className="md:col-span-2 space-y-5">
        <Card title="Images">
        {data? (
           <ImageSlider images={images} />
        ) : (
          <Skeleton height={300}/>
        )}
         
        </Card>

        <Card title="Property Info">
        {!data ? (
           <Skeleton count={6} height={20} className="mb-2" />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
          {data?.specifications
  ?.filter(
    (item) =>
      item.group?.name === "Property Info" &&
      item.specification?.status === 1 &&
      item.value !== null &&
      item.value !== ""
  )
  .map((item, idx) => (
    <li className="block py-[10px]" key={idx}>
      <div className="flex space-x-2 rtl:space-x-reverse justify-between items-start">
        <div className="flex items-center space-x-2">
          {item.specification.icon ? (
            <img
              src={item.specification.icon}
              alt={item.specification.name}
              className="w-4 h-4 object-contain"
            />
          ) : (
            <Icon
              icon="heroicons-outline:information-circle"
              className="w-4 h-4 text-slate-500 dark:text-slate-300"
            />
          )}
          <div className="text-slate-600 text-sm dark:text-slate-300 font-medium">
            {item.specification.name}
          </div>
        </div>
        <div className="flex-none text-base text-slate-600 dark:text-slate-400 max-w-[150px] text-right">
          {Array.isArray(item.value)
            ? item.value.join(', ')
            : item.value || '-'}
        </div>
      </div>
    </li>
  ))}

</ul>

        )}
          
        </Card>
      </div>

      {/* Right Column */}
      <div className="md:col-span-3">
        <Card title="Ad Details">
          {!data ? (
                        <>
              <Skeleton height={30} width="60%" className="mb-3" />
              <Skeleton height={24} width="40%" className="mb-2" />
              <Skeleton height={20} width="50%" className="mb-4" />
              <Skeleton count={4} height={15} className="mb-2" />
              <Skeleton height={100} className="mb-4" />
              <Skeleton height={20} width="30%" className="mb-1" />
              <div className="flex flex-wrap mt-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="xl:mr-8 mr-3 mb-3 space-y-1" style={{ width: '150px' }}>
                    <Skeleton height={15} width="80%" />
                    <Skeleton height={20} width="100%" />
                  </div>
                ))}
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded px-4 pt-4 pb-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton height={15} width="60%" />
                    <Skeleton height={20} width="100%" />
                  </div>
                ))}
              </div>
            </>

          ) : (
            <>
              <div className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-1">
                {data.title}
              </div>

              <div className="inline-flex items-center bg-yellow-100 text-yellow-900 font-semibold text-xl px-4 py-1 rounded shadow-sm mb-2">
               <img
    src="/assets/images/icon/UAE_Dirham_Symbol.svg"
    alt="UAE Dirham Symbol"
    className="w-5 h-5 mr-2"
  />
  {data?.pricing?.fixed_price}
</div>


              <span className="flex font-normal text-sm dark:text-slate-400 text-slate-500 mb-4">
                <span className="text-base inline-block mr-1">
                  <Icon icon="heroicons-outline:location-marker" />
                </span>
                {data?.location?.full_address}
              </span>

              {data?.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                  {isExpanded || data.description.length <= 550
                    ? data.description
                    : `${data.description.slice(0, 550)}...`}
                  {data.description.length > 200 && (
                    <span
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-blue-500 cursor-pointer ml-1 inline-block"
                    >
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </span>
                  )}
                </p>
              )}

              <div className="flex flex-wrap mt-8">
                <InfoItem label="Reference ID" value={data?.reference_id} />
                <InfoItem label="Mobile Number" value={data?.contact?.phone} />
                <InfoItem label="Whatsapp" value={data?.contact?.whatsapp} />
                <InfoItem label="Email" value={data?.posted_by?.email} />
              </div>

              <div className="bg-slate-100 dark:bg-slate-700 rounded px-4 pt-4 pb-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Status */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Status
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        statusMap[data?.status?.current_status] ||
                        'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {data?.status?.current_status || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Grid Info */}
                <InfoGrid label="Category" value={data?.category?.main} />
                <InfoGrid label="Sub Category" value={data?.category?.sub} />
                <InfoGrid label="Posted By" value={data?.posted_by?.name} />
                <InfoGrid
                  label="Posted On"
                  value={new Date(data?.posted_on).toLocaleDateString('en-GB')}
                />
                <InfoGrid label="Posted Through" value={data?.posted_through} />
              </div>
            </>
          )}
        </Card>
        <span className='h-5 grid'></span>
{data?.specifications
  ?.filter(
    (item) =>
      item?.group?.name === "Amenities" &&
      item?.specification?.status === 1 &&
      item?.value !== null &&
      item?.value !== ""
  )
  .map((item, idx) => (
    <Card key={idx} title="Amenities">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(Array.isArray(item.value) ? item.value : [item.value]).map((val, i) => (
          <div key={i} className="flex items-center space-x-2 rtl:space-x-reverse">
            {item.specification.icon ? (
              <img
                src={item.specification.icon}
                alt={item.specification.name}
                className="w-5 h-5 object-contain"
              />
            ) : (
              <Icon
                icon="heroicons-outline:check-circle"
                className="w-5 h-5 text-green-500"
              />
            )}
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              {val}
            </span>
          </div>
        ))}
      </div>
    </Card>
  ))}

      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="xl:mr-8 mr-3 mb-3 space-y-1">
    <div className="font-semibold text-slate-500 dark:text-slate-400">{label}</div>
    <div className="text-base font-normal text-primary-700 dark:text-slate-300">
      {value || '-'}
    </div>
  </div>
);

const InfoGrid = ({ label, value }) => (
  <div className="space-y-2">
    <div className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</div>
    <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{value || '-'}</div>
  </div>
);

export default ProjectDetailsPage;
