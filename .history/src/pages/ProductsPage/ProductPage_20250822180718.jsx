import React, { useState, useEffect } from 'react'
import { WrapperProducts } from './style'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useProducts } from '../../context/useProducts'
import { Pagination, Row, Col } from 'antd'
import ProductFilter from '../../components/ProductFilter/ProductFilter'
import { useLocation } from 'react-router-dom'
const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const location = useLocation();

  // Fetch products from database
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/products')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Filter products - show products with isActive: true OR status: 'active' OR 'Hoạt động'
      const activeProducts = data.filter(product => 
        (product.isActive === true) || 
        (product.status === 'active') || 
        (product.status === 'Hoạt động')
      )
      setProducts(activeProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('ProductPage mounted, fetching products...');
    fetchProducts();
  }, []);

  // Sort products by creation date (newest first)
  const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    
    console.log('📍 Location state:', location.state);
    console.log('🔍 Search params:', { category, search });
    
    // Kiểm tra state từ navigation
    if (location.state?.selectedFilters) {
      console.log('🎯 Setting filters from navigation:', location.state.selectedFilters);
      setFilters(location.state.selectedFilters);
      setSearchTerm('');
    } else if (search) {
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
    } else if (!location.state?.selectedFilters) {
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
  }, [location.search, location.state]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const searchProducts = (products, searchTerm) => {
    if (!searchTerm.trim()) return products;
    const searchLower = searchTerm.toLowerCase();
    return products.filter(product => {
      if (product.name && product.name.toLowerCase().includes(searchLower)) {
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
    
    console.log('🔍 Filtering products:', {
      totalProducts: products.length,
      searchTerm,
      filters,
      filteredBySearch: filteredProducts.length
    });
    
    return filteredProducts.filter(product => {
      // Filter by categories - kiểm tra nhiều field có thể có
      if (filters.categories.length > 0) {
        const productCategory = (product.category || product.loai || product.type || '').toLowerCase();
        const hasMatchingCategory = filters.categories.some(cat => 
          productCategory.includes(cat.toLowerCase()) || 
          cat.toLowerCase().includes(productCategory)
        );
        
        console.log(`📦 Product "${product.name}": category="${productCategory}", filter="${filters.categories.join(', ')}", match=${hasMatchingCategory}`);
        
        if (!hasMatchingCategory) {
          return false;
        }
      }
      
      // Filter by brands - kiểm tra nhiều field có thể có
      if (filters.brands.length > 0) {
        const productBrand = (product.brand || product.thuongHieu || product.name || '').toLowerCase();
        if (!filters.brands.some(brand => 
          productBrand.includes(brand.toLowerCase()) || 
          brand.toLowerCase().includes(productBrand)
        )) {
          return false;
        }
      }
      
      // Filter by price range
      const productPrice = product.gia || product.price || 0;
      if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
        return false;
      }
      
      // Filter by rating (if product has rating)
      if (filters.rating && filters.rating > 0) {
        const productRating = product.rating || product.danhGia || 0;
        if (productRating < filters.rating) {
          return false;
        }
      }
      
      // Filter by status
      if (filters.status.length > 0) {
        const productStatus = product.trangThai || product.status || 'Mới';
        if (!filters.status.includes(productStatus)) {
          return false;
        }
      }
      
      return true;
    });
  };
  const filteredProducts = filterProducts(sortedProducts);
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
      activeFilters.push(`danh mục: ${filters.categories.join(', ')}`);
    }
    if (filters.brands.length > 0) {
      activeFilters.push(`thương hiệu: ${filters.brands.join(', ')}`);
    }
    if (filters.rating && filters.rating > 0) {
      activeFilters.push(`từ ${filters.rating} sao trở lên`);
    }
    if (filters.status.length > 0) {
      activeFilters.push(`trạng thái: ${filters.status.join(', ')}`);
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) {
      const minPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(filters.priceRange[0]);
      const maxPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(filters.priceRange[1]);
      activeFilters.push(`giá: ${minPrice} - ${maxPrice}`);
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
              products={sortedProducts}
            />
          </Col>
          <Col xs={24} md={18}>
            <div>
              {/* Hiển thị danh mục đang được lọc từ navigation */}
              {location.state?.selectedCategory && (
                <div style={{ 
                  background: '#e6f7ff', 
                  border: '1px solid #91d5ff', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '16px', color: '#1890ff' }}>
                    🎯 Đang xem danh mục: <strong>{location.state.selectedCategory}</strong>
                  </span>
                  <button
                    onClick={() => {
                      // Xóa state và reset về trang chủ
                      window.history.replaceState({}, document.title)
                      window.location.reload()
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #1890ff',
                      borderRadius: '4px',
                      padding: '4px 12px',
                      color: '#1890ff',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Xem tất cả
                  </button>
                </div>
              )}
              
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
