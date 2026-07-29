import React, { useState } from 'react';
import CategorySelect from './CategorySelect';
import { useRouter } from 'next/router';

const getCurrentLocalDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const TransactionForm = ({id}: {id?: string}) => {
  const router = useRouter();
  const [ formData, setFormData] = useState({
    id,
    name: '',
    date: getCurrentLocalDate(),
    description: '',
    amount: '',
    category_id: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/transaction/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...formData, amount: parseFloat(formData.amount) * 100}),
    })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      router.push('/');
    });
    console.log('Form data submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="fill-form">
      <div className="form-group">
        <label htmlFor="name">Transaction Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="category_id">Category</label>
        <CategorySelect value={formData.category_id} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={() => router.push('/')}>Cancel</button>
      </div>
    </form>
  )
};

export default TransactionForm;