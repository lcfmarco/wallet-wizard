import React, { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import Title from '../components/Title';

function index() {
  return (
    <div className="dashboard-container">
      <Title />

      <section className="dashboard-section">
        <CategoryList />
      </section>
      
      <section className="dashboard-section">
        <TransactionList />
      </section>
      
    </div>
  )
}

export default index;