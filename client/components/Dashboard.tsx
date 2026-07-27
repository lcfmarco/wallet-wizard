import React, { useEffect, useState } from "react";
import Category from "./Category";

type DashboardData = {
  period: {
    month: number;
    year: number;
  };

  summary: {
    totalSpent: number;
    transactionCount: number;
    averageTransaction: number;
    activeDays: number;
    averageActiveDaySpending: number;
  };

  largestTransaction: {
    id: string;
    name: string;
    date: string;
    amount: number;
    description: string;
    category_name: string;
  } | null;

  lastMonthSpending: {
    totalSpent: number;
    difference: number;
    percentageChange: number | null;
  };

  categorySummary: {
    categoryId: string;
    categoryName: string;
    transactionCount: number;
    totalSpent: number;
  }[];
};

function Dashboard({month, year}: {month: number, year: number}) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/dashboard/monthly?month=${month}&year=${year}`)
      .then((response) => response.json())
      .then((data) => {
        setDashboard(data);
      });
  }, [month, year]);

  if (!dashboard) {
    return <p>Loading dashboard...</p>;
  }

  const formatCurrent = (amount: number) => (amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <section>
      <h2>Monthly Dashboard</h2>
      <p>Total Spent: {formatCurrent(dashboard.summary.totalSpent)}</p>
      <p>Transactions: {dashboard.summary.transactionCount}</p>
    </section>
  );
}

export default Dashboard;