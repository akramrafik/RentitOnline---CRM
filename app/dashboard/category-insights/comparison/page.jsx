'use client';
import { useEffect, useState, useCallback } from "react";
import Card from "@/components/ui/card";
import { getInsightComparison, locationSearch } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import CompareFilter from "./filters";
import ComparisonRow from "./comparerow";
import Skeleton from "react-loading-skeleton";
import debounce from "lodash.debounce";

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
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    const emirate = searchParams.get("emirate");
    const location = searchParams.get("location");
    setFilters({
      category: category || null,
      emirate: emirate || null,
      location: location || null,
    });
  }, [searchParams]);

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    if (updatedFilters.category) params.set("category", updatedFilters.category);
    if (updatedFilters.emirate) params.set("emirate", updatedFilters.emirate);
    if (updatedFilters.location) params.set("location", updatedFilters.location);
    router.push(`?${params.toString()}`);
  };

  const fetchData = useCallback(async () => {
    if (!filters.category || !filters.emirate) return;
    setLoading(true);
    try {
      const res = await getInsightComparison(filters);
      const responseData = res?.data || {};
      setData(responseData);

      setFilterOptions({
        categories: responseData.categories?.map(cat => ({ value: cat.id, label: cat.name })) || [],
        emirates: responseData.emirates?.map(e => ({ value: e.id, label: e.name })) || [],
        locations: responseData.types?.map(t => ({ value: t, label: t })) || [],
      });
    } catch (err) {
      console.error("Error fetching comparison data:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fetchLocations = async (input) => {
    if (!filters.emirate || !input.trim()) return;
    try {
      const locresponse = await locationSearch({
        keyword: input.trim(),
        emirate_id: Number(filters.emirate),
      });
      setLocationOptions(locresponse.locations?.map(loc => ({
        value: loc.value,
        label: loc.name,
        city: loc.city
      })) || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchLocations, 300), [filters.emirate]);

  return (
    <>
      <div className="mb-5">
        <Card>
          <CompareFilter
            filters={filters}
            onChange={handleFilterChange}
            categoryOptions={filterOptions.categories}
            emirateOptions={filterOptions.emirates}
            locationOptions={locationOptions}
            onLocationInputChange={(val) => {
              setLocationInput(val);
              debouncedFetch(val);
            }}
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            loading={loading}
          />
        </Card>
      </div>

      <Card>
        <div className="card table_of_compare">
          <div className="table-container">
            <div className="header-row">
              <div className="cell header-cell">Deira - Dubai</div>
              {filterOptions.locations.map((t) => (
                <div className="cell" key={t.value}>{t.label}</div>
              ))}
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
                      ...filterOptions.locations.map((type) =>
                        data?.rio_counts?.[type.value] || 0
                      ),
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
                          ...filterOptions.locations.map((t) => counts[t.value] || 0),
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
