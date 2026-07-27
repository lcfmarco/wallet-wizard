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

  const formatCurrency = (amount: number) => (amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const topCategory = dashboard.categorySummary.length > 0 ? dashboard.categorySummary[0] : null;

  return (
    <section className="dashboard">
      
      <div className="dashboard-header">
        <h2>Monthly Dashboard</h2>
        <p>{month}/{year}</p>
      </div>

      <div className="dashboard-grid">
      <div className="dashboard-card">
        <span className="dashboard-label">Total Spent</span>
        <strong className="dashboard-value">
          {formatCurrency(dashboard.summary.totalSpent)}
        </strong>
      </div>

      <div className="dashboard-card">
        <span className="dashboard-label">Transactions</span>
        <strong className="dashboard-value">
          {dashboard.summary.transactionCount}
        </strong>
      </div>

      <div className="dashboard-card">
        <span className="dashboard-label">
          Top Category
        </span>
        <strong className="dashboard-value">
          {topCategory ? `${topCategory.categoryName}` : "N/A"}
        </strong>
      </div>

      {/* <div className="dashboard-card">
        <span className="dashboard-label">
          Active Days
        </span>
        <strong className="dashboard-value">
          {dashboard.summary.activeDays}
        </strong>
      </div> */}


      </div>

      
    </section>
  );
}

export default Dashboard;