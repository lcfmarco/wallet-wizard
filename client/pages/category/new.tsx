import CategoryForm from "../../components/CategoryForm";

function AddCategoryPage() {

  const id = crypto.randomUUID();

  return (
    <div className="transaction-page">
      <div className="transaction-card">
        <h2>Add Category</h2>

        <CategoryForm id={id} />
      </div>
    </div>
  );
}

export default AddCategoryPage;