import React, { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Space,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
const { Option } = Select;
const { RangePicker } = DatePicker;
const OrderPage = () => {
  const [orders, setOrders] = useState([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      customerPhone: '0123456789',
      products: [
        { name: 'Fujifilm X-T4', quantity: 1, price: 25000000 },
        { name: 'Canon EOS R5', quantity: 1, price: 35000000 },
      ],
      totalAmount: 60000000,
      status: 'pending',
      orderDate: '2024-01-15',
      deliveryAddress: '123 Đường ABC, Quận 1, TP.HCM',
      paymentMethod: 'bank_transfer',
      notes: 'Giao hàng vào buổi sáng',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      customerPhone: '0987654321',
      products: [
        { name: 'Sony A7 III', quantity: 1, price: 28000000 },
        { name: 'Nikon Z6', quantity: 1, price: 32000000 },
      ],
      totalAmount: 60000000,
      status: 'processing',
      orderDate: '2024-01-14',
      deliveryAddress: '456 Đường XYZ, Quận 3, TP.HCM',
      paymentMethod: 'credit_card',
      notes: '',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      customerPhone: '0555666777',
      products: [{ name: 'Canon EOS 90D', quantity: 1, price: 18000000 }],
      totalAmount: 18000000,
      status: 'shipped',
      orderDate: '2024-01-13',
      deliveryAddress: '789 Đường DEF, Quận 7, TP.HCM',
      paymentMethod: 'cash',
      notes: 'Giao hàng vào buổi chiều',
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      customerPhone: '0333444555',
      products: [
        { name: 'Fujifilm X-T30', quantity: 1, price: 15000000 },
        { name: 'Sony A6400', quantity: 1, price: 20000000 },
      ],
      totalAmount: 35000000,
      status: 'delivered',
      orderDate: '2024-01-12',
      deliveryAddress: '321 Đường GHI, Quận 5, TP.HCM',
      paymentMethod: 'bank_transfer',
      notes: '',
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    order => order.status === 'pending'
  ).length;
  const processingOrders = orders.filter(
    order => order.status === 'processing'
  ).length;
  const shippedOrders = orders.filter(
    order => order.status === 'shipped'
  ).length;
  const deliveredOrders = orders.filter(
    order => order.status === 'delivered'
  ).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };
  const getStatusText = status => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đã gửi hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };
  const getPaymentMethodText = method => {
    switch (method) {
      case 'cash':
        return 'Tiền mặt';
      case 'credit_card':
        return 'Thẻ tín dụng';
      case 'bank_transfer':
        return 'Chuyển khoản';
      default:
        return method;
    }
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <div>
          <div>
            <strong>{text}</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.customerEmail}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'products',
      key: 'products',
      render: products => (
        <div>
          {products.map((product, index) => (
            <div key={`order-product-${product.id || product._id || index}`} style={{ marginBottom: '4px' }}>
              {product.name} x{product.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: amount => (
        <strong style={{ color: '#1890ff' }}>{formatCurrency(amount)}</strong>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: date => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: method => getPaymentMethodText(method),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            size='small'
            onClick={() => handleViewOrder(record)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => handleEditOrder(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size='small'
            onClick={() => handleDeleteOrder(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];
  const handleViewOrder = order => {
    setEditingOrder(order);
    setIsModalVisible(true);
  };
  const handleEditOrder = order => {
    setEditingOrder(order);
    setIsModalVisible(true);
  };
  const handleDeleteOrder = orderId => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        setOrders(orders.filter(order => order.id !== orderId));
      },
    });
  };
  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingOrder(null);
  };
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <OrderPageContainer>
      <PageHeader>
        <h1>Quản lý đơn hàng</h1>
        <Button type='primary' icon={<PlusOutlined />} size='large'>
          Tạo đơn hàng mới
        </Button>
      </PageHeader>
      {}
      <StatsContainer>
        <Row gutter={16}>
          <Col span={4}>
            <Card>
              <Statistic
                title='Tổng đơn hàng'
                value={totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title='Chờ xử lý'
                value={pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title='Đang xử lý'
                value={processingOrders}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title='Đã gửi hàng'
                value={shippedOrders}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title='Đã giao hàng'
                value={deliveredOrders}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title='Tổng doanh thu'
                value={formatCurrency(totalRevenue)}
                valueStyle={{ color: '#52c41a', fontSize: '16px' }}
              />
            </Card>
          </Col>
        </Row>
      </StatsContainer>
      {}
      <FiltersContainer>
        <Row gutter={16} align='middle'>
          <Col span={8}>
            <Input
              placeholder='Tìm kiếm đơn hàng...'
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              size='large'
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder='Lọc theo trạng thái'
              value={statusFilter}
              onChange={setStatusFilter}
              size='large'
              style={{ width: '100%' }}
            >
              <Option value='all'>Tất cả</Option>
              <Option value='pending'>Chờ xử lý</Option>
              <Option value='processing'>Đang xử lý</Option>
              <Option value='shipped'>Đã gửi hàng</Option>
              <Option value='delivered'>Đã giao hàng</Option>
              <Option value='cancelled'>Đã hủy</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker size='large' style={{ width: '100%' }} />
          </Col>
          <Col span={4}>
            <Button
              icon={<FilterOutlined />}
              size='large'
              style={{ width: '100%' }}
            >
              Lọc
            </Button>
          </Col>
        </Row>
      </FiltersContainer>
      {}
      <TableContainer>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey='id'
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
        />
      </TableContainer>
      {}
      <Modal
        title='Chi tiết đơn hàng'
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        width={800}
        footer={[
          <Button key='back' onClick={handleModalOk}>
            Đóng
          </Button>,
          <Button key='submit' type='primary' onClick={handleModalOk}>
            Cập nhật
          </Button>,
        ]}
      >
        {editingOrder && (
          <OrderDetailContainer>
            <Row gutter={16}>
              <Col span={12}>
                <h3>Thông tin đơn hàng</h3>
                <p>
                  <strong>Mã đơn hàng:</strong> {editingOrder.orderNumber}
                </p>
                <p>
                  <strong>Ngày đặt:</strong>{' '}
                  {new Date(editingOrder.orderDate).toLocaleDateString('vi-VN')}
                </p>
                <p>
                  <strong>Trạng thái:</strong>
                  <Tag
                    color={getStatusColor(editingOrder.status)}
                    style={{ marginLeft: '8px' }}
                  >
                    {getStatusText(editingOrder.status)}
                  </Tag>
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{' '}
                  {getPaymentMethodText(editingOrder.paymentMethod)}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{' '}
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    {formatCurrency(editingOrder.totalAmount)}
                  </span>
                </p>
              </Col>
              <Col span={12}>
                <h3>Thông tin khách hàng</h3>
                <p>
                  <strong>Tên:</strong> {editingOrder.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {editingOrder.customerEmail}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {editingOrder.customerPhone}
                </p>
                <p>
                  <strong>Địa chỉ giao hàng:</strong>{' '}
                  {editingOrder.deliveryAddress}
                </p>
                {editingOrder.notes && (
                  <p>
                    <strong>Ghi chú:</strong> {editingOrder.notes}
                  </p>
                )}
              </Col>
            </Row>
            <div style={{ marginTop: '20px' }}>
              <h3>Sản phẩm</h3>
              <Table
                dataSource={editingOrder.products}
                pagination={false}
                columns={[
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'price',
                    key: 'price',
                    render: price => formatCurrency(price),
                  },
                  {
                    title: 'Thành tiền',
                    key: 'total',
                    render: (_, record) =>
                      formatCurrency(record.price * record.quantity),
                  },
                ]}
              />
            </div>
          </OrderDetailContainer>
        )}
      </Modal>
    </OrderPageContainer>
  );
};
const OrderPageContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  h1 {
    margin: 0;
    color: #1890ff;
    font-size: 28px;
    font-weight: bold;
  }
`;
const StatsContainer = styled.div`
  margin-bottom: 24px;
`;
const FiltersContainer = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
const TableContainer = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
const OrderDetailContainer = styled.div`
  h3 {
    color: #1890ff;
    margin-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 8px;
  }
  p {
    margin-bottom: 8px;
    line-height: 1.6;
  }
`;
export default OrderPage;
