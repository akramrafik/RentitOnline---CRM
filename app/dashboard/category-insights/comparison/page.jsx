'use client';
import { useEffect, useState } from "react";
import Card from "@/components/ui/card";
import getInsightCoparison from "@/lib/agents_api";
import CompareFilter from "./filters";
import ComparisonRow from "./comparerow";
import Skeleton from "react-loading-skeleton";

export default function ComparePage() {
  const [filters, setFilters] = useState({
    category: null,
    emirate: null,
    location: null,
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    emirates: [],
    locations: [],
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await getComparisonFilterData(); // <- endpoint returning categories, emirates, types
        setFilterOptions({
          categories: res.categories.map((c) => ({ value: c.id, label: c.name })),
          emirates: res.emirates.map((e) => ({ value: e.id, label: e.name })),
          locations: res.types?.map((l) => ({ value: l.id, label: l.name })) || [],
        });
      } catch (err) {
        console.error("Error loading filters:", err);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!filters.category || !filters.emirate) return;

      setLoading(true);
      try {
        const res = await getInsightCoparison(filters);
        setData(res?.data || null);
      } catch (err) {
        console.error("Error fetching comparison data:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <>
      <div className="mb-5">
        <Card>
          <CompareFilter
            filters={filters}
            onChange={handleFilterChange}
            loading={loadingFilters}
            categoryOptions={filterOptions.categories}
            emirateOptions={filterOptions.emirates}
            locationOptions={filterOptions.locations}
          />
        </Card>
      </div>

      <Card>
        <div className="card table_of_compare">
          <div className="table-container">
            <div className="header-row">
              <div className="cell header-cell">Deira - Dubai</div>
              <div className="cell">Single</div>
              <div className="cell">Partition</div>
              <div className="cell">Studio Room</div>
              <div className="cell">Bedspace</div>
              <div className="cell">Maid Room</div>
              <div className="cell">Vendors</div>
            </div>

            <div className="compared_column">
              {loading ? (
                <Skeleton count={4} height={60} className="mb-2" />
              ) : (
                <>
                  <ComparisonRow
                    logo="https://demoadmin.rentitonline.ae/argon/img/brand/logo.png"
                    alt="RentItOnline"
                    data={[
                      data?.rio_counts?.[2] || 0,
                      data?.rio_counts?.[27] || 0,
                      data?.rio_counts?.[29] || 0,
                      data?.rio_counts?.[30] || 0,
                      data?.rio_counts?.[31] || 0,
                      data?.rio_counts?.[32] || 0,
                      data?.rio_counts?.vendor_count || 0,
                    ]}
                  />

                  {data?.competitors?.map((competitor, index) => {
                    const counts = data.competitor_data?.[index] || {};
                    return (
                      <ComparisonRow
                        key={competitor.id}
                        logo={competitor.logo}
                        alt={competitor.name}
                        data={[
                          counts[2] || 0,
                          counts[27] || 0,
                          counts[29] || 0,
                          counts[30] || 0,
                          counts[31] || 0,
                          counts[32] || 0,
                          counts.vendor_count || 0,
                        ]}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
