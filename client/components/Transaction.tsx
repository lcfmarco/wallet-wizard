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

  const handleSubmit = async ( e: React.SubmitEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/transaction/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      }
    );
    const data = await response.json();
    console.log("Transaction updated:", data);
    router.replace("/");
  };
  
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

  return (
  <div className="transaction-page">
    <div className="transaction-card">
      <h2>Edit Transaction</h2>

      <form 
        className="transaction-form"
        onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Transaction Name</label>

          <input
            id="name"
            name="name"
            type="text"
            value={transaction.name}
            onChange={(e) =>
              setTransaction((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category_id">Category</label>

          <CategorySelect
            value={transaction.category_id}
            onChange={(e) =>
              setTransaction((prev) => ({ ...prev, category_id: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>

          <input
            id="description"
            name="description"
            type="text"
            value={transaction.description}
            onChange={(e) =>
              setTransaction((prev) => ({ ...prev, description: e.target.value

              }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>

          <input
            id="date"
            name="date"
            type="date"
            value={new Date(transaction.date).toISOString().split("T")[0]}
            onChange={(e) =>
              setTransaction((prev) => ({ ...prev, date: new Date(e.target.value) }))
            }
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
            value={(transaction.amount / 100).toFixed(2)}
            onChange={(e) => {
              const value = parseFloat(e.target.value) * 100;
              setTransaction((prev) => ({ ...prev, amount: value }));
            }}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit"
            >Save Transaction</button>

          <button type="button">Delete Transaction</button>

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