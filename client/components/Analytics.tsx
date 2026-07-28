import React, { useEffect, useState } from "react";

type CategorySummary = {
  categoryId: string;
  categoryName: string;
  transactionCount: number;
  totalSpent: number;
};

type LargestTransaction = {
  id: string;
  name: string;
  date: string;
  amount: number;
  description: string;
  category_name: string;
};

type AnalyticsData = {
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

  largestTransaction: LargestTransaction | null;

  previousMonthComparison: {
    totalSpent: number;
    difference: number;
    percentageChange: number | null;
  };

  categorySummary: CategorySummary[];
};

function Analytics({
    month,
    year,
  }: {
    month: number;
    year: number;
  }) {
    const [analytics, setAnalytics] =
      useState<AnalyticsData | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);

      fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/analytics/monthly?month=${month}&year=${year}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAnalytics(data);
          setLoading(false);
        });
    }, [month, year]);

    if (loading) {
      return <p>Loading analytics...</p>;
    }

    if (!analytics) {
      return <p>No analytics available.</p>;
    }

    return (
      <section className="analytics">
        <h2>Monthly Analytics</h2>

        <p>
          Total spent:{" "}
          {(analytics.summary.totalSpent / 100).toLocaleString(
            "en-us",
            {
              style: "currency",
              currency: "USD",
            }
          )}
        </p>
      </section>
    );
  }

export default Analytics;