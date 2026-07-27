import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type Transaction = {
  id: string;
  name: string;
  category_name: string;
  date: Date;
  amount: number;
  created_at: Date;
};

function TransactionList({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/transaction?month=${month}&year=${year}`)
      .then((response) => response.json())
      .then((data) => {
        setTransaction(data);
        setLoading(false);
      });
  }, [month, year]);

  if (loading) {
    return <p>Loading...</p>;
  };

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Transaction Name</th>
            <th>Category Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {transaction.map((item, index) => (
            <tr key={item.id} onClick={() => router.push(`/transaction/${item.id}`)}>
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