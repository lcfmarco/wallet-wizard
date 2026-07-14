import React, { useEffect, useState } from 'react';

function TransactionList() {
  const [transaction, setTransaction] = useState<{ id: string; name: string; category_name: string; date: Date; amount: number; created_at: Date; }[] | string>("Loading...");

  useEffect(() => {
    fetch("http://localhost:3100/api/transaction")
      .then((response) => response.json())
      .then((data) => {
        setTransaction(data);
      });
  }, []);
  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Transaction Name</th>
            <th>Category Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(transaction) && transaction.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.category_name}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{(item.amount / 100).toLocaleString('en-us', { style: 'currency', currency: 'USD' })}</td>
              <td>{new Date(item.created_at).toLocaleDateString('en-US', { timeZoneName: 'short'})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionList;