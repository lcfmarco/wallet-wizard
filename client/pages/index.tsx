import React, { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';
import Title from '../components/Title';

function index() {
  return (
    <div>
      <Title />
      <CategoryList />
      <TransactionList />
    </div>
  )
}

export default index;