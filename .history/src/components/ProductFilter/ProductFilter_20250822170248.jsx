import React, { useState, useEffect } from 'react';
import {
  Card,
  Checkbox,
  Slider,
  Button,
  Space,
  Typography,
  Divider,
  Rate,
} from 'antd';
import {
  FilterOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const ProductFilter = ({ onFilterChange, products }) => {
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState([]);

  // Available filter options
  const categories = ['Máy ảnh', 'Ống kính', 'Phụ kiện', 'Gimbal', 'Máy quay'];
  const brands = ['CANON', 'NIKON', 'SONY', 'FUJIFILM', 'DJI', 'GOPRO'];
  const statuses = ['Mới', 'Đã sử dụng', 'Tân trang'];

  // Get unique brands from products
  const availableBrands = products ? 
    [...new Set(products.map(product => product.thuongHieu).filter(Boolean))] : 
    brands;

  // Get price range from products
  const getPriceRange = () => {
    if (!products || products.length === 0) return [0, 100000000];
    
    const prices = products.map(product => product.gia).filter(price => price > 0);
    if (prices.length === 0) return [0, 100000000];
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return [minPrice, maxPrice];
  };

  // Initialize price range from products
  useEffect(() => {
    const [min, max] = getPriceRange();
    setPriceRange([min, max]);
  }, [products]);

  // Handle category selection
  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    }
  };

  // Handle brand selection
  const handleBrandChange = (brand, checked) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  // Handle status selection
  const handleStatusChange = (status, checked) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, status]);
    } else {
      setSelectedStatus(selectedStatus.filter(s => s !== status));
    }
  };

  // Handle rating selection
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  // Handle price range change
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(getPriceRange());
    setSelectedRating(0);
    setSelectedStatus([]);
  };

  // Apply filters
  const applyFilters = () => {
    const filters = {
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: priceRange,
      rating: selectedRating,
      status: selectedStatus,
    };
    
    onFilterChange(filters);
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <FilterContainer>
      <Card>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Space>
            <FilterOutlined style={{ color: '#1890ff' }} />
            <Title level={5} style={{ margin: 0 }}>Bộ lọc sản phẩm</Title>
          </Space>
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={clearFilters}
            size="small"
          >
            Xóa bộ lọc
          </Button>
        </div>

        {/* Categories */}
        <FilterSection>
          <Title level={5} style={{ marginBottom: '12px' }}>Danh mục</Title>
          {categories.map(category => (
            <div key={category} style={{ marginBottom: '8px' }}>
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
              >
                {category}
              </Checkbox>
            </div>
          ))}
        </FilterSection>

        <Divider style={{ margin: '16px 0' }} />

        {/* Brands */}
        <FilterSection>
          <Title level={5} style={{ marginBottom: '12px' }}>Thương hiệu</Title>
          {availableBrands.map(brand => (
            <div key={brand} style={{ marginBottom: '8px' }}>
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onChange={(e) => handleBrandChange(brand, e.target.checked)}
              >
                {brand}
              </Checkbox>
            </div>
          ))}
        </FilterSection>

        <Divider style={{ margin: '16px 0' }} />

        {/* Price Range */}
        <FilterSection>
          <Title level={5} style={{ marginBottom: '12px' }}>Khoảng giá</Title>
          <Slider
            range
            min={0}
            max={100000000}
            step={1000000}
            value={priceRange}
            onChange={handlePriceChange}
            tipFormatter={formatPrice}
            style={{ marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </FilterSection>

        <Divider style={{ margin: '16px 0' }} />

        {/* Rating */}
        <FilterSection>
          <Title level={5} style={{ marginBottom: '12px' }}>Đánh giá</Title>
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} style={{ marginBottom: '8px', cursor: 'pointer' }} onClick={() => handleRatingChange(rating)}>
              <Rate 
                disabled 
                value={rating} 
                style={{ fontSize: '14px' }}
              />
              <Text style={{ marginLeft: '8px', color: selectedRating === rating ? '#1890ff' : '#666' }}>
                Từ {rating} sao trở lên
              </Text>
            </div>
          ))}
        </FilterSection>

        <Divider style={{ margin: '16px 0' }} />

        {/* Status */}
        <FilterSection>
          <Title level={5} style={{ marginBottom: '12px' }}>Trạng thái</Title>
          {statuses.map(status => (
            <div key={status} style={{ marginBottom: '8px' }}>
              <Checkbox
                checked={selectedStatus.includes(status)}
                onChange={(e) => handleStatusChange(status, e.target.checked)}
              >
                {status}
              </Checkbox>
            </div>
          ))}
        </FilterSection>

        {/* Apply Button */}
        <div style={{ marginTop: '24px' }}>
          <Button 
            type="primary" 
            block 
            onClick={applyFilters}
            style={{ height: '40px' }}
          >
            Áp dụng bộ lọc
          </Button>
          <Text style={{ fontSize: '12px', color: '#666', textAlign: 'center', display: 'block', marginTop: '8px' }}>
            Bấm "Áp dụng bộ lọc" để xem kết quả
          </Text>
        </div>
      </Card>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  width: 280px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 16px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 16px;
`;

export default ProductFilter;
