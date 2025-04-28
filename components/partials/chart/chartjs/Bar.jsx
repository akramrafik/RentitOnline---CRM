import React, { useEffect, useState } from "react";
import { getDashboardData } from "@/lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { colors, hexToRGB } from "@/constant/data";
import useDarkMode from "@/hooks/useDarkMode";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Function to get last 7 days
const getLast7Days = () => {
  const days = [];
  for (let i = 7; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }));
  }
  return days;
};

const BarChart = () => {
  const [isDark] = useDarkMode();
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState(getLast7Days()); 

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData(); // Fetching the data
        const lastWeekAds = response.data.last_week_ads;
        // Extract the dates and ad counts from the response
        const last7Days = Object.keys(lastWeekAds);
        const adCounts = last7Days.map((day) => lastWeekAds[day]);
        setLabels(last7Days); // Use the days as labels
        setChartData([adCounts]); // Use the ad counts for the data
      } catch (error) {
        console.error("Error fetching 7days chart data:", error);
        setChartData([]); // Optionally, handle error with fallback
      }
    };

    fetchData();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        data: chartData.length ? chartData : Array(7).fill(0), 
        fill: false,
        backgroundColor: hexToRGB(colors.primary, 0.6),
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 15,
        borderSkipped: "bottom",
        barThickness: 25,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide label
      },
    },
    scales: {
      y: {
        grid: {
          color: isDark ? "#334155" : "#e2e8f0",
        },
        ticks: {
          color: isDark ? "#cbd5e1" : "#475569",
        },
      },
      x: {
        grid: {
          color: isDark ? "#334155" : "#e2e8f0",
        },
        ticks: {
          color: isDark ? "#cbd5e1" : "#475569",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div>
      <Bar options={options} data={data} height={350} />
    </div>
  );
};

export default BarChart;
