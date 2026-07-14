import React, { useEffect, useState } from 'react';

function CategoryList() {
  const [category, setCategory] = useState<{ id: string; category_name: string; created_at: Date; }[] | string>("Loading...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/category`)
      .then((response) => response.json())
      .then((data) => {
        setCategory(data);
      });
  }, []);
  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(category) && category.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.category_name}</td>
              <td>{new Date(item.created_at).toLocaleDateString('en-US', { timeZoneName: 'short'})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryList;