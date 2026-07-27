import Transaction from "../../components/Transaction";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <div style={{ textAlign: "center" }}>
      <Transaction id={id} />
    </div>
  )
}

export default Index;