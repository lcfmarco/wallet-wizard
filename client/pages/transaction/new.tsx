import TransactionForm from "../../components/TransactionForm";

function AddTransactionPage() {

  const id = crypto.randomUUID();

  return (
    <div className="transaction-page">
      <div className="transaction-card">
        <h2>Add Transaction</h2>

        <TransactionForm id={id} />
      </div>
    </div>
  );
}

export default AddTransactionPage;