import { useParams } from 'react-router-dom';
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent';
import { useProducts } from '../../context/useProducts';
const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find(p => p._id === id || p.id === id);
  if (!product) {
    return (
      <div
        style={{
          padding: '0 120px',
          backgroundColor: '#f5f5f5',
          height: '1000px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2>Sản phẩm không tồn tại</h2>
      </div>
    );
  }
  return (
    <div
      style={{
        padding: '0 120px',
        backgroundColor: '#f5f5f5',
        height: '1000px',
      }}
    >
      <div style={{ 
        marginBottom: '20px',
        fontSize: '16px',
        fontWeight: '500',
        color: '#333'
      }}>
        <span 
          style={{ 
            cursor: 'pointer', 
            color: '#1890ff',
            textDecoration: 'underline'
          }}
          onClick={() => window.location.href = '/'}
        >
          Trang chủ
        </span>
        <span style={{ margin: '0 8px', color: '#999' }}>/</span>
        <span 
          style={{ 
            cursor: 'pointer', 
            color: '#1890ff',
            textDecoration: 'underline'
          }}
          onClick={() => window.location.href = `/products?category=${encodeURIComponent(product.category)}`}
        >
          {product.category}
        </span>
        <span style={{ margin: '0 8px', color: '#999' }}>/</span>
        <span style={{ color: '#333' }}>{product.name}</span>
      </div>
      <ProductDetailComponent product={product} />
    </div>
  );
};
export default ProductDetailsPage;
