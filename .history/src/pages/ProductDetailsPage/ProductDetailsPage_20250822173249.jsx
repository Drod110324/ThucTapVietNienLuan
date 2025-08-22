import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent';
import { message } from 'antd';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details from database
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      message.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);
  if (loading) {
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
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1890ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <h2>Đang tải...</h2>
        </div>
      </div>
    );
  }

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
