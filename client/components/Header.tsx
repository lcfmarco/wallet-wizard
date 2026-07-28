import Link from "next/link";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="header-logo">
          Wallet Wizard
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/" className={router.pathname === "/" ? "nav-link active" : "nav-link"}>Overview</Link>
          <Link href="/category" className={router.pathname === "/category" ? "nav-link active" : "nav-link"}>Categories</Link>
          <Link href="/analytics" className={router.pathname === "/analytics" ? "nav-link active" : "nav-link"}>Analytics</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header;
