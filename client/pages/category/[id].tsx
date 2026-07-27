import Category from "../../components/Category";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <div style={{ textAlign: "center" }}>
      <Category id={id} />
    </div>
  )
}

export default Index;