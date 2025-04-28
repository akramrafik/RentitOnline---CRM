import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useDarkMode from "@/hooks/useDarkMode";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BasicArea = ({ height = 350, data }) => {
  const [isDark] = useDarkMode();
  const [monthlyChartData, setmonthlyChartData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (!data) return;

    const monthlyData = Object.values(data).map((item) => item.count);
    const monthlyLabels = Object.values(data).map((item) => item.date);

    setLabels(monthlyLabels);
    setmonthlyChartData(monthlyData);
  }, [data]);

  const series = [
    {
      name: "Ads Posted",
      data: monthlyChartData.length ? monthlyChartData : Array(12).fill(0),
    },
  ];

  const options = {
    chart: { toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 4 },
    colors: ["#4669FA"],
    tooltip: { theme: isDark ? "dark" : "light" },
    grid: {
      show: true,
      borderColor: isDark ? "#334155" : "#e2e8f0",
      strokeDashArray: 10,
      position: "back",
    },
    fill: {
      type: "gradient",
      colors: "#4669FA",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.5,
        stops: [50, 100, 0],
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Lato",
        },
      },
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Lato",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="area" height={height} width="100%" />
    </div>
  );
};

export default BasicArea;
