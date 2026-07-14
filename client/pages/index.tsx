import React, { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import Title from '../components/Title';

function index() {
  return (
    <div className="dashboard-container">
      <Title />

      <section className="dashboard-section">
        <h2>Categories</h2>
        <CategoryList />
      </section>
      
      <section className="dashboard-section">
        <h2>Transactions</h2>
        <TransactionList />
      </section>
      
    </div>
  )
}

export default index;