import Category from "../../components/Category";
import Title from "../../components/Title";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <div style={{ textAlign: "center" }}>
      <Title />
      <h1>Category Page</h1>
      <Category id={id} />
    </div>
  )
}

export default Index;