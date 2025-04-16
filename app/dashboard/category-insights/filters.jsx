import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Icon from "@/components/ui/Icon";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
import { getCategoryInsights } from "@/lib/agents_api";

const getRandomColor = () => {
  const bgColors = [
    "bg-[#ECF1FF]",
    "bg-[#EDE8FB]",
    "bg-[#FDEDEC]",
    "bg-[#E7FBFE]",
    "bg-[#FCEFEE]",
  ];
  const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
  return { randomBg, randomText: "text-white" };
};

const CategoryInsightFilter = () => {
  const [categories, setCategories] = useState([]);
  const [emirates, setEmirates] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEmirate, setSelectedEmirate] = useState(null);
  const [location, setLocation] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getCategoryInsights({
          category: selectedCategory?.value,
          emirate: selectedEmirate?.value,
          location: location?.value,
          page: 1,
        });

        const data = response?.data;

        if (Array.isArray(data?.categories)) {
          setCategories(
            data.categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))
          );
        }

        if (Array.isArray(data?.emirates)) {
          setEmirates(
            data.emirates.map((e) => ({
              value: e.id,
              label: e.name,
            }))
          );
        }

        if (Array.isArray(data?.location_counts?.data)) {
          setLocations(
            data.location_counts.data.map((loc) => ({
              value: loc.location,
              label: loc.location,
            }))
          );
        }

        if (data?.summery && typeof data.summery === "object") {
          const results = [
            {
              types: Object.keys(data.summery),
              summary: data.summery,
            },
          ];
          setInsights(results);
        } else {
          setInsights([]);
        }
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    };

    // Update the URL
    let url = "/dashboard/category-insights";
    const params = new URLSearchParams();

    if (selectedCategory?.value) params.append("category", selectedCategory.value);
    if (selectedEmirate?.value) params.append("emirate", selectedEmirate.value);
    if (location?.value) params.append("location", location.value);

    if (params.toString()) url += "?" + params.toString();
    router.push(url);

    // Fetch data
    fetchData();
  }, [selectedCategory, selectedEmirate, location]);

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid grid-cols-3 gap-5">
          {/* Category Select */}
          {loading ? (
            <Skeleton height={38} />
          ) : (
            <ReactSelect
              options={categories}
              value={selectedCategory}
              placeholder="Choose Category"
              onChange={(selected) => {
                setSelectedCategory(selected);
                setSelectedEmirate(null);
                setLocation(null);
              }}
            />
          )}

          {/* Emirate Select */}
          {loading ? (
            <Skeleton height={38} />
          ) : (
            <ReactSelect
              options={emirates}
              value={selectedEmirate}
              placeholder="Choose Emirate"
              onChange={(selected) => {
                setSelectedEmirate(selected);
                setLocation(null);
              }}
              isDisabled={!selectedCategory}
            />
          )}

          {/* Location Select */}
          {loading ? (
            <Skeleton height={38} />
          ) : (
            <ReactSelect
              options={locations}
              value={location}
              placeholder="Choose Location"
              onChange={setLocation}
              isDisabled={!selectedEmirate}
            />
          )}
        </div>
      </Card>

      <div className="overflow-x-auto">
        <div className="grid xl:grid-cols-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <Card key={index} bodyClass="pt-4 pb-3 px-4">
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none">
                    <Skeleton circle height={48} width={48} />
                  </div>
                  <div className="flex-1">
                    <Skeleton width="80%" height={15} />
                    <Skeleton width="60%" height={20} />
                  </div>
                </div>
              </Card>
            ))
          ) : insights.length > 0 ? (
            insights.map((item, index) =>
              item.types.map((type, idx) => {
                const { randomBg, randomText } = getRandomColor();
                return (
                  <Card bodyClass="pt-4 pb-3 px-4" key={`${index}-${idx}`}>
                    <div className="flex space-x-3 rtl:space-x-reverse">
                      <div className="flex-none">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${randomBg} ${randomText}`}
                        >
                          <Icon icon="heroicons-outline:document-chart-bar" className="text-slate-900 text-opacity-60" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-600 dark:text-slate-300 text-sm mb-1 font-medium">
                          {type}
                        </div>
                        <div className="text-slate-900 dark:text-white text-lg font-medium">
                          {item.summary[type] ?? 0}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )
          ) : (
            <p>No insights found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryInsightFilter;
