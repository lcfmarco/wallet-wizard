import React, { useState } from 'react';
import { useRouter } from 'next/router';

const CategoryForm = ({id}:{id:string}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id,
    name: '',
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
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/category/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      router.push('/category');
    });
    console.log('Form data submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-group">
        <label htmlFor="name">Category Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <button type="submit">Add Category</button>
    </form>
  )
};

export default CategoryForm;