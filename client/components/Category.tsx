import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Category = {
  id: string;
  category_name: string;
  created_at: string;
};

function Category({ id }: { id: string }) {
  const router = useRouter();

  const [category, setCategory] = useState<Category>({
    id: "",
    category_name: "",
    created_at: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/category/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCategory(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="transaction-page">
      <div className="transaction-card">
        <h2>Edit Category</h2>

        <form className="transaction-form">
          <div className="form-group">
            <label htmlFor="category_name">Category Name</label>

            <input
              id="category_name"
              name="category_name"
              type="text"
              value={category.category_name}
              onChange={(e) =>
                setCategory((prev) => ({
                  ...prev,
                  category_name: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-actions">
            <button type="button">
              Save Category
            </button>

            <button type="button" onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Category;