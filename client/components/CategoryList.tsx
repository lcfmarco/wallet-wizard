import React, { useEffect, useState } from 'react';

type Category = {
  id: string;
  category_name: string;
  created_at: Date;
};

function CategoryList() {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/category`)
      .then((response) => response.json())
      .then((data) => {
        setCategory(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Categories</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {category.map((item, index) => (
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