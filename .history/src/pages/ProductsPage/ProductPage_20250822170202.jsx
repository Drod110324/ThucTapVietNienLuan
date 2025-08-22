import React, { useState, useEffect } from 'react'
import { WrapperProducts } from './style'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useProducts } from '../../context/useProducts'
import { Pagination, Row, Col } from 'antd'
import ProductFilter from '../../components/ProductFilter/ProductFilter'
import { useLocation } from 'react-router-dom'
const ProductPage = () => {
  const { getAllActiveProducts, refreshProducts } = useProducts();
  const location = useLocation();
  useEffect(() => {
    console.log(' ProductPage mounted, refreshing products...');
    refreshProducts();
  }, [refreshProducts]);
  const allProducts = getAllActiveProducts();
  const products = [...allProducts].sort((a, b) => parseInt(b.id) - parseInt(a.id));
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 100000000],
    rating: null,
    status: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    } else {
      setSearchTerm('');
    }
    if (category) {
      const newFilters = {
        categories: [category],
        brands: [],
        priceRange: [0, 100000000],
        rating: null,
        status: []
      };
      setFilters(newFilters);
    } else {
      const defaultFilters = {
        categories: [],
        brands: [],
        priceRange: [0, 100000000],
        rating: null,
        status: []
      };
      setFilters(defaultFilters);
    }
    setCurrentPage(1);
  }, [location.search]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const searchProducts = (products, searchTerm) => {
    if (!searchTerm.trim()) return products;
    const searchLower = searchTerm.toLowerCase();
    return products.filter(product => {
      if (product.name.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (product.brand && product.brand.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (product.category && product.category.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (product.description && product.description.toLowerCase().includes(searchLower)) {
        return true;
      }
      return false;
    });
  };
  const filterProducts = (products) => {
    let filteredProducts = searchProducts(products, searchTerm);
    return filteredProducts.filter(product => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      if (filters.brands.length > 0) {
        const productBrand = product.name.toLowerCase();
        const hasMatchingBrand = filters.brands.some(brand => 
          productBrand.includes(brand.toLowerCase())
        );
        if (!hasMatchingBrand) {
          return false;
        }
      }
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      if (filters.rating && product.rating < filters.rating) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(product.status)) {
        return false;
      }
      return true;
    });
  };
  const filteredProducts = filterProducts(products);
  const itemsPerPage = 15; 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  }
  const getFilterTitle = () => {
    const activeFilters = [];
    if (searchTerm.trim()) {
      activeFilters.push(`tìm kiếm "${searchTerm}"`);
    }
    if (filters.categories.length > 0) {
      activeFilters.push(filters.categories.join(', '));
    }
    if (filters.brands.length > 0) {
      activeFilters.push(filters.brands.join(', '));
    }
    if (filters.rating) {
      activeFilters.push(`Từ ${filters.rating} sao trở lên`);
    }
    if (filters.status.length > 0) {
      activeFilters.push(filters.status.join(', '));
    }
    if (activeFilters.length > 0) {
      return `Sản phẩm ${activeFilters.join(' - ')} (${filteredProducts.length} sản phẩm)`;
    }
    return `Tất cả sản phẩm (${filteredProducts.length} sản phẩm)`;
  }
  return (
    <div style={{ width: '100%', background: '#efefef', padding: '20px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[24, 0]} style={{ flexWrap: 'nowrap' }}>
          <Col xs={24} md={6}>
            <ProductFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              products={products}
            />
          </Col>
          <Col xs={24} md={18}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                {getFilterTitle()}
              </h1>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
                Khám phá bộ sưu tập đa dạng các sản phẩm camera chất lượng cao
              </p>
              {filteredProducts.length > 0 ? (
                <>
                  <WrapperProducts>
                    {displayedProducts.map((product, index) => (
                      <CardComponent key={product._id || product.id || `product-${index}`} product={product} />
                    ))}
                  </WrapperProducts>
                  {filteredProducts.length > itemsPerPage && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <Pagination
                        current={currentPage}
                        total={filteredProducts.length}
                        pageSize={itemsPerPage}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total, range) => 
                          `${range[0]}-${range[1]} của ${total} sản phẩm`
                        }
                        style={{ marginBottom: '20px' }}
                      />
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                        Hiển thị {itemsPerPage} sản phẩm mỗi trang
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#666',
                  fontSize: '16px'
                }}>
                  Không có sản phẩm nào phù hợp với bộ lọc
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  ) 
}
export default ProductPage
