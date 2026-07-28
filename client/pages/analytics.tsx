import React, { useState } from "react";
import Analytics from "../components/Analytics";
import Header from "../components/Header";

function AnalyticsPage() {
  const currentDate = new Date();

  const [month, setMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [year, setYear] = useState(
    currentDate.getFullYear()
  );

  return (
    <main className="page-container">
      <Header />
      <section className="page-header">
        <div>
          <h1>Analytics</h1>
        </div>
      </section>

      <Analytics month={month} year={year} />
    </main>
  );
}

export default AnalyticsPage;