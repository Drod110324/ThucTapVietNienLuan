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
    rating: 4.5,
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
        image: values.mainImage, // Map mainImage to image field for backward compatibility
        images: auxiliaryImages
          .filter(img => img.url.trim())
          .map(img => img.url),
        // Ensure all required fields are present
        isActive: true,
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const result = await response.json();
      
      message.success('Thêm sản phẩm thành công!');
      form.resetFields();
      setAuxiliaryImages([]);
      
      if (onSuccess) {
        onSuccess(result);
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
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>Thêm sản phẩm mới</Title>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={handleCancel}
          size="small"
        />
      </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
          requiredMark={true}
          size="small"
        >
          {/* Product Information */}
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input 
                  placeholder="Nhập tên sản phẩm..."
                  size="small"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục" size="small">
                  {categories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="Thương hiệu"
                rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
              >
                <Select placeholder="Chọn thương hiệu" size="small">
                  {brands.map(brand => (
                    <Option key={brand} value={brand}>{brand}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Pricing and Stock Information */}
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  placeholder="0"
                  size="small"
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
                  size="small"
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
                <Select placeholder="Chọn trạng thái" size="small">
                  {statuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="Đánh giá"
              >
                <InputNumber
                  placeholder="0.0"
                  size="small"
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
                  size="small"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Image Upload Section */}
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="mainImage"
                label="Ảnh chính (URL)"
                rules={[{ required: true, message: 'Vui lòng nhập URL ảnh chính!' }]}
              >
                <Input 
                  placeholder="https://example.com/image.jpg"
                  size="small"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: '24px' }}>
                <Form.Item name="mainImagePreview" label=" ">
                  {form.getFieldValue('mainImage') && (
                    <Image
                      width={60}
                      height={60}
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
              <div key={image.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <Input
                  placeholder="Nhập URL ảnh phụ..."
                  value={image.url}
                  onChange={(e) => handleAuxiliaryImageChange(image.id, e.target.value)}
                  style={{ flex: 1, marginRight: '8px' }}
                  size="small"
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemoveAuxiliaryImage(image.id)}
                  danger
                  size="small"
                />
              </div>
            ))}
            
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddAuxiliaryImage}
              size="small"
              style={{ width: '100%', marginTop: '6px' }}
            >
              Thêm ảnh phụ
            </Button>

            {/* Preview auxiliary images */}
            {auxiliaryImages.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Xem trước ảnh phụ:</Text>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {auxiliaryImages
                    .filter(img => img.url.trim())
                    .map((image) => (
                      <Image
                        key={image.id}
                        width={50}
                        height={50}
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
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
          >
            <TextArea
              rows={3}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              size="small"
            />
          </Form.Item>

          <Divider />

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', marginTop: '16px' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              size="small"
              loading={loading}
              style={{ minWidth: '100px' }}
            >
              Thêm sản phẩm
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              size="small"
              style={{ minWidth: '100px' }}
            >
              Hủy
            </Button>
          </div>
        </Form>
      </div>
    );
};

export default AddProductForm;
