import React, { useEffect, useState } from 'react';

type Category = {
  id: string;
  category_name: string;
  created_at: Date;
};

function CategorySelect({value, onChange}: {value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void}) {
  const [category, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/category`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCategoryList(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <select value={value} onChange={onChange} required>
      <option value="">Select a Category</option>
      {category.map((item) => (
        <option key={item.id} value={item.id}>{item.category_name}</option>
      ))}
    </select>
  );
};

export default CategorySelect;