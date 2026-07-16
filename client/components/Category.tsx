import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  created_at: Date;
};

function Category({ id }: { id: string }) {
  const router = useRouter();

  const [category, setCategory] = useState<Category>({
    id: "",
    name: "",
    created_at: new Date(),
  });

  const [loading, setLoading] = useState(true);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Category updated:", data);
        setCategory(data);
        router.replace("/");
      });
  };

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

        <form className="transaction-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="id">ID</label>
            {category.id}
          </div>

          <div className="form-group">
            <label htmlFor="name">Category Name</label>

            <input
              id="name"
              name="name"
              type="text"
              value={category.name}
              onChange={(e) =>
                setCategory((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="created_at">Created At</label>
            {new Date(category.created_at).toLocaleString("en-US", { timeZoneName: "short" })}
          </div>

          <div className="form-actions">
            <button type="submit">Save</button>

            <button type="button" onClick={() => {
              fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/category/${id}`, {
                method: "DELETE",
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Category deleted:", data);
                  router.replace("/");
                });
            }}>
              Delete
            </button>

            <button type="button" onClick={() => router.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Category;