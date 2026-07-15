import Transaction from "../../components/Transaction";
import Title from "../../components/Title";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <div style={{ textAlign: "center" }}>
      <Title />
      <h1>Transaction Page</h1>
      <Transaction id={id} />
    </div>
  )
}

export default Index;