import TransactionForm from "../../components/TransactionForm";

function AddTransactionPage() {
  return (
    <div className="transaction-page">
      <div className="transaction-card">
        <h2>Add Transaction</h2>

        <TransactionForm />
      </div>
    </div>
  );
}

export default AddTransactionPage;