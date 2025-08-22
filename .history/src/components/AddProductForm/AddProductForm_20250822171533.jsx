import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  Space,
  Typography,
  message,
  Image,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddProductForm = ({ onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [auxiliaryImages, setAuxiliaryImages] = useState([]);

  // Form initial values
  const initialValues = {
    name: '',
    category: '',
    brand: '',
    price: 0,
    stock: 0,
    rating: 0,
    sold: 0,
    status: 'Hoạt động',
    mainImage: '',
    description: '',
  };

  // Available options
  const categories = ['Máy ảnh', 'Ống kính', 'Phụ kiện', 'Gimbal', 'Máy quay'];
  const brands = ['CANON', 'NIKON', 'SONY', 'FUJIFILM', 'DJI', 'GOPRO'];
  const statuses = ['Hoạt động', 'Tạm ngưng', 'Hết hàng'];

  // Handle adding auxiliary image
  const handleAddAuxiliaryImage = () => {
    const newImage = {
      id: Date.now(),
      url: '',
    };
    setAuxiliaryImages([...auxiliaryImages, newImage]);
  };

  // Handle removing auxiliary image
  const handleRemoveAuxiliaryImage = (id) => {
    setAuxiliaryImages(auxiliaryImages.filter(img => img.id !== id));
  };

  // Handle auxiliary image URL change
  const handleAuxiliaryImageChange = (id, url) => {
    setAuxiliaryImages(auxiliaryImages.map(img => 
      img.id === id ? { ...img, url } : img
    ));
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Prepare product data
      const productData = {
        ...values,
        auxiliaryImages: auxiliaryImages
          .filter(img => img.url.trim())
          .map(img => img.url),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Send to backend
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const result = await response.json();
      
      message.success('Thêm sản phẩm thành công!');
      form.resetFields();
      setAuxiliaryImages([]);
      
      if (onSuccess) {
        onSuccess(result.product);
      }
      
    } catch (error) {
      console.error('Error creating product:', error);
      message.error('Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <FormContainer>
      <Card>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0 }}>Thêm sản phẩm mới</Title>
          <Button 
            type="text" 
            icon={<CloseCircleOutlined />} 
            onClick={handleCancel}
            size="large"
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
          requiredMark={true}
        >
          {/* Product Information */}
          <Title level={4} style={{ marginBottom: '16px' }}>Thông tin sản phẩm</Title>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input 
                  placeholder="Nhập tên sản phẩm..."
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục" size="large">
                  {categories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="Thương hiệu"
                rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
              >
                <Select placeholder="Chọn thương hiệu" size="large">
                  {brands.map(brand => (
                    <Option key={brand} value={brand}>{brand}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Pricing and Stock Information */}
          <Title level={4} style={{ marginBottom: '16px', marginTop: '24px' }}>Thông tin giá và tồn kho</Title>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  placeholder="0"
                  size="large"
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="stock"
                label="Tồn kho"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
              >
                <InputNumber
                  placeholder="0"
                  size="large"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái" size="large">
                  {statuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="Đánh giá"
              >
                <InputNumber
                  placeholder="0.0"
                  size="large"
                  style={{ width: '100%' }}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sold"
                label="Đã bán"
              >
                <InputNumber
                  placeholder="0"
                  size="large"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Image Upload Section */}
          <Title level={4} style={{ marginBottom: '16px', marginTop: '24px' }}>Hình ảnh sản phẩm</Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mainImage"
                label="Ảnh chính (URL)"
                rules={[{ required: true, message: 'Vui lòng nhập URL ảnh chính!' }]}
              >
                <Input 
                  placeholder="Nhập URL ảnh chính..."
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: '32px' }}>
                <Form.Item name="mainImagePreview" label=" ">
                  {form.getFieldValue('mainImage') && (
                    <Image
                      width={80}
                      height={80}
                      src={form.getFieldValue('mainImage')}
                      alt="Ảnh chính"
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                  )}
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Form.Item label="Ảnh phụ (URLs)">
            {auxiliaryImages.map((image) => (
              <div key={image.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Input
                  placeholder="Nhập URL ảnh phụ..."
                  value={image.url}
                  onChange={(e) => handleAuxiliaryImageChange(image.id, e.target.value)}
                  style={{ flex: 1, marginRight: '8px' }}
                  size="large"
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemoveAuxiliaryImage(image.id)}
                  danger
                  size="large"
                />
              </div>
            ))}
            
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddAuxiliaryImage}
              size="large"
              style={{ width: '100%', marginTop: '8px' }}
            >
              Thêm ảnh phụ
            </Button>

            {/* Preview auxiliary images */}
            {auxiliaryImages.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Text type="secondary">Xem trước ảnh phụ:</Text>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {auxiliaryImages
                    .filter(img => img.url.trim())
                    .map((image) => (
                      <Image
                        key={image.id}
                        width={60}
                        height={60}
                        src={image.url}
                        alt="Ảnh phụ"
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ))}
                </div>
              </div>
            )}
          </Form.Item>

          {/* Description */}
          <Title level={4} style={{ marginBottom: '16px', marginTop: '24px' }}>Mô tả sản phẩm</Title>
          
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              size="large"
            />
          </Form.Item>

          <Divider />

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              size="large"
              loading={loading}
              style={{ minWidth: '120px' }}
            >
              Thêm sản phẩm
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              size="large"
              style={{ minWidth: '120px' }}
            >
              Hủy
            </Button>
          </div>
        </Form>
      </Card>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export default AddProductForm;
