import React, { useState } from "react";
import Analytics from "../components/Analytics";
import Header from "../components/Header";

function AnalyticsPage() {
  const currentDate = new Date();

  const [month] = useState(
    currentDate.getMonth() + 1
  );

  const [year] = useState(
    currentDate.getFullYear()
  );

  return (
    <main className="page-container">
      <Header />
      <Analytics month={month} year={year} />
    </main>
  );
}

export default AnalyticsPage;