import { useRouter } from "next/router";
import CategorySelect from "./CategorySelect";
import React, { useEffect, useState } from "react";

type Transaction = {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  description: string;
  date: Date;
  amount: number;
  created_at: Date;
};

function Transaction({ id }: { id: string}) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction>({
    id: "",
    name: "",
    category_id: "",
    category_name: "",
    description: "",
    date: new Date(),
    amount: 0,
    created_at: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/transaction/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTransaction(data);
        setLoading(false);
      });
  
}, [id]);

  if (loading) {
    return <p>Loading...</p>;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTransaction({
      ...transaction,
      [name]: value,
    });
  };

  return (
  <div className="transaction-page">
    <div className="transaction-card">
      <h2>Edit Transaction</h2>

      <form className="transaction-form">
        <div className="form-group">
          <label htmlFor="name">Transaction Name</label>

          <input
            id="name"
            name="name"
            type="text"
            value={transaction.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category_id">Category</label>

          <CategorySelect
            value={transaction.category_id}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>

          <input
            id="description"
            name="description"
            type="text"
            value={transaction.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>

          <input
            id="date"
            name="date"
            type="date"
            value={new Date(transaction.date).toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>

          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={transaction.amount / 100}
            onChange={(e) =>
              setTransaction({
                ...transaction,
                amount: Math.round(Number(e.target.value) * 100),
              })
            }
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Save Transaction</button>

          <button
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);


};

export default Transaction;