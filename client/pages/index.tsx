import React, { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import CategoryList from '../components/CategoryList';

function index() {
  return (
    <div>
    <CategoryList />
    <TransactionList />
    </div>
  )
}

export default index;