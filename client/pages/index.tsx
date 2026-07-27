import React, { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import Title from '../components/Title';
import Dashboard from '../components/Dashboard';

const months = [
  {value: 1, label: 'January'},
  {value: 2, label: 'February'},
  {value: 3, label: 'March'},
  {value: 4, label: 'April'},
  {value: 5, label: 'May'},
  {value: 6, label: 'June'},
  {value: 7, label: 'July'},
  {value: 8, label: 'August'},
  {value: 9, label: 'September'},
  {value: 10, label: 'October'},
  {value: 11, label: 'November'},
  {value: 12, label: 'December'},
];

function index() {

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const years = Array.from(
    { length: 5},
    (_, index) => today.getFullYear() - index 
  );

  return (
    <div className="page-container">
      <Title />

      <section className="page-section">
        <Dashboard month={month} year={year} />
      </section>

      <section className="page-section">
        <CategoryList />
      </section>
      
      <section className="page-section">
        <div className="transaction-filter">
          <div>
            <label htmlFor="month">Month:</label>
            <select id="month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <select id="year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <TransactionList month={month} year={year}/>
      </section>
      
    </div>
  )
}

export default index;