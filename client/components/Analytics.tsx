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

  lastMonthSpending: {
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
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/analytics/monthly?month=${month}&year=${year}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to retrieve analytics.");
        }

        return response.json();
      })
      .then((data) => {
        setAnalytics(data);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [month, year]);

  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const formatSignedCurrency = (amount: number) => {
    const formattedAmount = formatCurrency(Math.abs(amount));

    if (amount > 0) {
      return `+${formattedAmount}`;
    }

    if (amount < 0) {
      return `-${formattedAmount}`;
    }

    return formattedAmount;
  };

  const formatPercentage = (
    percentage: number | null
  ) => {
    if (percentage === null) {
      return "N/A";
    }

    if (percentage > 0) {
      return `+${percentage}%`;
    }

    return `${percentage}%`;
  };

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!analytics) {
    return <p>No analytics available.</p>;
  }

  return (
    <section className="analytics-page">
      <div className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p>
            Explore your spending patterns for the month.
          </p>
        </div>
      </div>

      <div className="analytics-highlights">
        <div className="dashboard-card">
          <span className="dashboard-label">
            Total Spent
          </span>

          <strong className="dashboard-value">
            {formatCurrency(analytics.summary.totalSpent)}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-label">
            Transactions
          </span>

          <strong className="dashboard-value">
            {analytics.summary.transactionCount}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-label">
            Change From Previous Month
          </span>

          <strong className="dashboard-value">
            {formatPercentage(analytics.lastMonthSpending.percentageChange)}
          </strong>
        </div>
      </div>

      <section className="analytics-panel">
        <div className="analytics-section-header">
          <div>
            <h2>Previous Month Comparison</h2>
            <p>Compare the selected month with the month before it.</p>
          </div>
        </div>

        <div className="comparison-list">
          <div className="comparison-item">
            <span>Current month</span>
            <strong>
              {formatCurrency(analytics.summary.totalSpent)}
            </strong>
          </div>

          <div className="comparison-item">
            <span>Previous month</span>
            <strong>
              {formatCurrency(analytics.lastMonthSpending.totalSpent)}
            </strong>
          </div>

          <div className="comparison-item">
            <span>Difference</span>
            <strong>
              {formatSignedCurrency(analytics.lastMonthSpending.difference)}
            </strong>
          </div>

          <div className="comparison-item">
            <span>Percentage change</span>
            <strong>
              {formatPercentage(analytics.lastMonthSpending.percentageChange)}
            </strong>
          </div>
        </div>
      </section>

      <div className="analytics-details">
        <section className="analytics-panel">
          <h2>Spending Activity</h2>

          <dl className="analytics-stat-list">
            <div className="analytics-stat-row">
              <dt>Average transaction</dt>
              <dd>{formatCurrency(analytics.summary.averageTransaction)}
              </dd>
            </div>

            <div className="analytics-stat-row">
              <dt>Active spending days</dt>
              <dd>{analytics.summary.activeDays}</dd>
            </div>

            <div className="analytics-stat-row">
              <dt>Average per active day</dt>
              <dd>{formatCurrency(analytics.summary.averageActiveDaySpending)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="analytics-panel">
          <span className="analytics-eyebrow">
            Largest Transaction
          </span>

          {analytics.largestTransaction ? (
            <>
              <div className="largest-transaction-header">
                <div>
                  <h2>{analytics.largestTransaction.name}</h2>
                  <p>{analytics.largestTransaction.category_name}
                  </p>
                </div>

                <strong className="largest-transaction-amount">
                  {formatCurrency(analytics.largestTransaction.amount)}
                </strong>
              </div>

              <p className="largest-transaction-date">
                {new Date(analytics.largestTransaction.date).toLocaleDateString("en-US")}
              </p>

              {analytics.largestTransaction.description && (
                <p className="largest-transaction-description">
                  {analytics.largestTransaction.description}
                </p>
              )}
            </>
          ) : (
            <p>No transactions for this month.</p>
          )}
        </section>
      </div>

      <section
        id="category-spending"
        className="analytics-panel"
      >
        <div className="analytics-section-header">
          <div>
            <h2>Spending by Category</h2>
            <p>Categories ranked by total spending.</p>
          </div>
        </div>

        {analytics.categorySummary.length > 0 ? (
          <div className="category-ranking">
            {analytics.categorySummary.map(
              (category, index) => {
                const percentage = analytics.summary.totalSpent > 0 ? ((category.totalSpent / analytics.summary.totalSpent) * 100).toFixed(1) : "0.0";

                return (
                  <div
                    key={category.categoryId}
                    className="category-ranking-row"
                  >
                    <span className="category-rank">
                      {index + 1}
                    </span>

                    <div className="category-ranking-name">
                      <strong>
                        {category.categoryName}
                      </strong>

                      <span>
                        {category.transactionCount}{" "}
                        {category.transactionCount === 1 ? "transaction" : "transactions"}
                      </span>
                    </div>

                    <div className="category-ranking-value">
                      <strong>
                        {formatCurrency(category.totalSpent)}
                      </strong>

                      <span>{percentage}%</span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <p>No category spending for this month.</p>
        )}
      </section>
    </section>
  );
}

export default Analytics;