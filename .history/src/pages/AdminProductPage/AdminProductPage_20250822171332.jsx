import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Space, 
  Popconfirm, 
  message, 
  Card, 
  Row, 
  Col, 
  Statistic,
  Tag,
  Image
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { PRODUCT_CATEGORIES } from '../../constants/categories';
import { PRODUCT_BRANDS } from '../../constants/brands';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
const { Option } = Select;
const { TextArea } = Input;
const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({});
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [additionalImageUrls, setAdditionalImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const API_BASE_URL = 'http://localhost:5000';
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/stats/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  const refreshData = async () => {
    try {
      await Promise.all([fetchProducts(), fetchStats()]);
    } catch {
      message.error('Có lỗi khi làm mới dữ liệu');
    }
  };
  useEffect(() => {
    refreshData();
  }, []);
  // Handle new product form success
  const handleAddProductSuccess = (newProduct) => {
    setShowAddProductForm(false);
    setProducts([newProduct, ...products]);
    message.success('Thêm sản phẩm thành công!');
  };

  // Handle close add product form
  const handleCloseAddProductForm = () => {
    setShowAddProductForm(false);
  };

  const handleSubmit = async (values) => {
    try {
      setUploading(true);
      const productData = {
        ...values,
        image: mainImageUrl,
        images: additionalImageUrls
      };
      const url = editingProduct 
        ? `${API_BASE_URL}/products/${editingProduct._id}`
        : `${API_BASE_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
             if (response.ok) {
         const successMessage = editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!';
         message.success(successMessage);
         localStorage.setItem('productsLastUpdate', Date.now().toString());
         localStorage.setItem('productsChanged', 'true');
         setModalVisible(false);
         form.resetFields();
         setEditingProduct(null);
         setMainImageUrl('');
         setAdditionalImageUrls([]);
         setTimeout(() => {
           refreshData();
         }, 100);
       } else {
        const error = await response.json();
        message.error(error.message || 'Có lỗi xảy ra');
      }
    } catch {
      message.error('Không thể kết nối đến server');
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
             if (response.ok) {
         message.success('Xóa sản phẩm thành công!');
         localStorage.setItem('productsLastUpdate', Date.now().toString());
         localStorage.setItem('productsChanged', 'true');
         refreshData();
       } else {
        message.error('Không thể xóa sản phẩm');
      }
    } catch {
      message.error('Không thể kết nối đến server');
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      rating: product.rating,
      sold: product.sold,
      status: product.status,
    });
    setMainImageUrl(product.image || '');
    setAdditionalImageUrls(product.images || []);
    setModalVisible(true);
  };
  const handleMainImageUrlChange = (e) => {
    setMainImageUrl(e.target.value);
  };
  const _handleAdditionalImageUrlChange = (e) => {
    const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
    setAdditionalImageUrls(urls);
  };
  const addAdditionalImageUrl = () => {
    setAdditionalImageUrls(prev => [...prev, '']);
  };
  const removeAdditionalImageUrl = (index) => {
    setAdditionalImageUrls(prev => prev.filter((_, i) => i !== index));
  };
  const updateAdditionalImageUrl = (index, value) => {
    setAdditionalImageUrls(prev => {
      const newUrls = [...prev];
      newUrls[index] = value;
      return newUrls;
    });
  };

  const columns = [
         {
       title: 'Hình ảnh',
       dataIndex: 'image',
       key: 'image',
       width: 80,
       render: (image) => (
         <Image
           width={60}
           height={60}
           src={image || 'https://via.placeholder.com/60x60?text=No+Image'}
           style={{ objectFit: 'cover', borderRadius: '4px' }}
           onError={(e) => {
             e.target.src = 'https://via.placeholder.com/60x60?text=Error'
           }}
         />
       ),
     },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
         {
       title: 'Danh mục',
       dataIndex: 'category',
       key: 'category',
       render: (category) => (
         <Tag color="blue">{category}</Tag>
       ),
     },
     {
       title: 'Thương hiệu',
       dataIndex: 'brand',
       key: 'brand',
       render: (brand) => (
         <Tag color="green">{brand}</Tag>
       ),
     },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `${rating}/5`,
    },
    {
      title: 'Đã bán',
      dataIndex: 'sold',
      key: 'sold',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Quản lý Sản phẩm</h1>
      {}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={stats.activeProducts || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Không hoạt động"
              value={stats.inactiveProducts || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Danh mục"
              value={stats.categoryStats?.length || 0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
             {}
       <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
         <Button
           type="primary"
           icon={<PlusOutlined />}
           onClick={() => setShowAddProductForm(true)}
           size="large"
         >
           Thêm sản phẩm mới
         </Button>
         <Button
           icon={<ReloadOutlined />}
           onClick={refreshData}
           loading={loading}
           size="large"
         >
           Làm mới
         </Button>
       </div>
      {}
      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} sản phẩm`,
        }}
      />
      {}
      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingProduct(null);
          form.resetFields();
          setMainImageUrl('');
          setAdditionalImageUrls([]);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'active',
            rating: 4.5,
            sold: 0,
            stock: 0,
            images: []
          }}
        >
                     <Row gutter={16}>
             <Col span={12}>
               <Form.Item
                 name="name"
                 label="Tên sản phẩm"
                 rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
               >
                 <Input />
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item
                 name="category"
                 label="Danh mục"
                 rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
               >
                 <Select>
                   {PRODUCT_CATEGORIES.map(category => (
                     <Option key={category} value={category}>{category}</Option>
                   ))}
                 </Select>
               </Form.Item>
             </Col>
           </Row>
           <Row gutter={16}>
             <Col span={12}>
               <Form.Item
                 name="brand"
                 label="Thương hiệu"
                 rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
               >
                 <Select
                   showSearch
                   placeholder="Chọn thương hiệu"
                   optionFilterProp="children"
                   filterOption={(input, option) =>
                     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                   }
                 >
                   {PRODUCT_BRANDS.map(brand => (
                     <Option key={brand} value={brand}>{brand}</Option>
                   ))}
                 </Select>
               </Form.Item>
             </Col>
           </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
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
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
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
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
                     <Row gutter={16}>
             <Col span={12}>
               <Form.Item
                 label="Ảnh chính (URL)"
                 rules={[{ required: true, message: 'Vui lòng nhập URL ảnh chính!' }]}
               >
                 <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                   <Input
                     placeholder="https://example.com/image.jpg"
                     value={mainImageUrl}
                     onChange={handleMainImageUrlChange}
                     style={{ flex: 1 }}
                   />
                   {mainImageUrl && (
                     <div style={{ position: 'relative' }}>
                       <img 
                         src={mainImageUrl} 
                         alt="main preview" 
                         style={{ 
                           width: '80px', 
                           height: '80px', 
                           objectFit: 'cover',
                           borderRadius: '4px',
                           border: '1px solid #d9d9d9'
                         }} 
                         onError={(e) => {
                           e.target.style.display = 'none';
                         }}
                       />
                     </div>
                   )}
                 </div>
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item label="Ảnh phụ (URLs)">
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   {additionalImageUrls.map((url, index) => (
                     <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                       <Input
                         placeholder={`URL ảnh phụ ${index + 1}`}
                         value={url}
                         onChange={(e) => updateAdditionalImageUrl(index, e.target.value)}
                         style={{ flex: 1 }}
                       />
                       <Button
                         size="small"
                         type="text"
                         danger
                         onClick={() => removeAdditionalImageUrl(index)}
                       >
                         ×
                       </Button>
                     </div>
                   ))}
                   <Button 
                     size="small" 
                     icon={<PlusOutlined />}
                     onClick={addAdditionalImageUrl}
                     style={{ alignSelf: 'flex-start' }}
                   >
                     Thêm ảnh phụ
                   </Button>
                 </div>
                 {}
                 {additionalImageUrls.length > 0 && (
                   <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                     {additionalImageUrls.map((url, index) => (
                       url && (
                         <div key={index} style={{ position: 'relative' }}>
                           <img 
                             src={url} 
                             alt={`additional ${index + 1}`} 
                             style={{ 
                               width: '60px', 
                               height: '60px', 
                               objectFit: 'cover',
                               borderRadius: '4px',
                               border: '1px solid #d9d9d9'
                             }} 
                             onError={(e) => {
                               e.target.style.display = 'none';
                             }}
                           />
                         </div>
                       )
                     ))}
                   </div>
                 )}
               </Form.Item>
             </Col>
           </Row>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={uploading}>
                {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
              </Button>
                             <Button onClick={() => {
                 setModalVisible(false);
                 setEditingProduct(null);
                 form.resetFields();
                 setMainImageUrl('');
                 setAdditionalImageUrls([]);
               }}>
                 Hủy
               </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Product Form Modal */}
      {showAddProductForm && (
        <AddProductForm
          onClose={handleCloseAddProductForm}
          onSuccess={handleAddProductSuccess}
        />
      )}
    </div>
  );
};
export default AdminProductPage;
