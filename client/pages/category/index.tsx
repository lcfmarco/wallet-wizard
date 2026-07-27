import CategoryList from '../../components/CategoryList';
import Header from '../../components/Header';

function CategoryPage() {
  return (
    <div className="page-container">
      <Header />
      <div className="page-section">
        <CategoryList />
      </div>
    </div>
  )
}

export default CategoryPage;