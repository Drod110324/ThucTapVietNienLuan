import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  DatePicker, 
  Select, 
  Button, 
  Table, 
  Tag, 
  Space,
  Input
} from 'antd';
import { 
  DollarOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  ShoppingBagOutlined,
  EyeOutlined,
  DownloadOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { WrapperContainerLeft, WrapperContainerRight } from './style';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [reportType, setReportType] = useState('daily');

  // Mock data cho thống kê
  const statsData = [
    {
      title: 'Tổng doanh thu',
      value: 125000000,
      prefix: <DollarOutlined style={{ color: '#52c41a' }} />,
      suffix: 'VNĐ',
      trend: '+12.5%',
      trendColor: '#52c41a'
    },
    {
      title: 'Tổng đơn hàng',
      value: 156,
      prefix: <ShoppingCartOutlined style={{ color: '#1890ff' }} />,
      trend: '+8.3%',
      trendColor: '#52c41a'
    },
    {
      title: 'Tổng khách hàng',
      value: 82,
      prefix: <UserOutlined style={{ color: '#722ed1' }} />
    },
    {
      title: 'Tổng sản phẩm',
      value: 16,
      prefix: <ShoppingBagOutlined style={{ color: '#fa8c16' }} />
    }
  ];

  // Mock data cho biểu đồ doanh thu
  const revenueData = [
    { period: 'T1', revenue: 85000000 },
    { period: 'T2', revenue: 92000000 },
    { period: 'T3', revenue: 78000000 },
    { period: 'T4', revenue: 105000000 },
    { period: 'T5', revenue: 125000000 },
    { period: 'T6', revenue: 98000000 }
  ];

  // Mock data cho đơn hàng gần đây
  const recentOrdersColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => `#${text}`
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer'
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (value) => `${value.toLocaleString('vi-VN')} ₫`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          'completed': { color: 'green', text: 'Hoàn thành' },
          'processing': { color: 'blue', text: 'Đang xử lý' },
          'delivered': { color: 'orange', text: 'Đã giao hàng' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate'
    }
  ];

  const recentOrdersData = [
    {
      key: '1',
      orderId: 1,
      customer: 'Nguyễn Văn A',
      product: 'Canon EOS R5, Ống kính...',
      total: 85000000,
      status: 'completed',
      orderDate: '15/1/2024'
    },
    {
      key: '2',
      orderId: 2,
      customer: 'Trần Thị B',
      product: 'Sony A7 IV',
      total: 45000000,
      status: 'processing',
      orderDate: '14/1/2024'
    },
    {
      key: '3',
      orderId: 3,
      customer: 'Lê Văn C',
      product: 'Nikon Z6 III, Ống kính 70-200mm',
      total: 95000000,
      status: 'delivered',
      orderDate: '13/1/2024'
    },
    {
      key: '4',
      orderId: 4,
      customer: 'Phạm Thị D',
      product: 'Fujifilm X-T5',
      total: 32000000,
      status: 'completed',
      orderDate: '12/1/2024'
    },
    {
      key: '5',
      orderId: 5,
      customer: 'Hoàng Văn E',
      product: 'Canon EOS R6 Mark II',
      total: 68000000,
      status: 'processing',
      orderDate: '11/1/2024'
    }
  ];

  // Mock data cho bảng xếp hạng sản phẩm
  const productRankingColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'unitsSold',
      key: 'unitsSold',
      render: (value) => `${value} chiếc`
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => `${value.toLocaleString('vi-VN')} ₫`
    },
    {
      title: 'Tăng trưởng',
      dataIndex: 'growth',
      key: 'growth',
      render: (value) => {
        const isPositive = value.startsWith('+');
        return <Tag color={isPositive ? 'green' : 'red'}>{value}</Tag>;
      }
    }
  ];

  const productRankingData = [
    {
      key: '1',
      product: 'Canon EOS R5',
      unitsSold: 15,
      revenue: 1200000000,
      growth: '+25%'
    },
    {
      key: '2',
      product: 'Sony A7 IV',
      unitsSold: 12,
      revenue: 540000000,
      growth: '+18%'
    },
    {
      key: '3',
      product: 'Nikon Z6 III',
      unitsSold: 10,
      revenue: 950000000,
      growth: '+32%'
    },
    {
      key: '4',
      product: 'Fujifilm X-T5',
      unitsSold: 8,
      revenue: 320000000,
      growth: '-5%'
    },
    {
      key: '5',
      product: 'Canon EOS R6 Mark II',
      unitsSold: 7,
      revenue: 476000000,
      growth: '+15%'
    }
  ];

  const handleViewReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Generating report for:', { dateRange, reportType });
    }, 1000);
  };

  const handleExportExcel = () => {
    console.log('Exporting to Excel...');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        backgroundColor: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: '#52c41a', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px'
          }}>
            📷
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Camera</span>
        </div>
        
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 24px' }}>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            size="large"
            style={{ borderRadius: '20px' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold' }}>viethuu0</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Admin</div>
          </div>
          <div style={{ position: 'relative' }}>
            <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              1
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div>Giỏ hàng</div>
            <div>Đơn hàng của tôi</div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          Dashboard - Thống kê & Báo cáo
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Tổng quan về doanh thu, đơn hàng và hiệu suất kinh doanh
        </p>
      </div>

      {/* Report Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Khoảng thời gian:</span>
            <RangePicker 
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '280px' }}
            />
          </Col>
          <Col>
            <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Loại báo cáo:</span>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: '150px' }}
            >
              <Option value="daily">Hàng ngày</Option>
              <Option value="weekly">Hàng tuần</Option>
              <Option value="monthly">Hàng tháng</Option>
            </Select>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<EyeOutlined />}
                onClick={handleViewReport}
                loading={loading}
                size="large"
              >
                Xem báo cáo
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleExportExcel}
                size="large"
              >
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: '#3f8600' }}
              />
              {stat.trend && (
                <div style={{ 
                  color: stat.trendColor, 
                  fontSize: '14px', 
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {stat.trend.includes('+') ? '↗' : '↘'} {stat.trend}
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Revenue Chart */}
      <Card 
        title={
          <span>
            <BarChartOutlined style={{ marginRight: '8px' }} />
            Biểu đồ doanh thu
          </span>
        }
        style={{ marginBottom: '24px' }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          justifyContent: 'space-around',
          height: '200px',
          padding: '20px 0'
        }}>
          {revenueData.map((item, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: `${(item.revenue / 125000000) * 150}px`,
                backgroundColor: '#1890ff',
                borderRadius: '4px 4px 0 0',
                margin: '0 auto 8px auto'
              }} />
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.period}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {(item.revenue / 1000000).toFixed(0)}M ₫
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tables Row */}
      <Row gutter={[16, 16]}>
        {/* Recent Orders */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <CalendarOutlined style={{ marginRight: '8px' }} />
                Đơn hàng gần đây
              </span>
            }
          >
            <Table
              columns={recentOrdersColumns}
              dataSource={recentOrdersData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Product Ranking */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <BarChartOutlined style={{ marginRight: '8px' }} />
                Bảng xếp hạng sản phẩm
              </span>
            }
          >
            <Table
              columns={productRankingColumns}
              dataSource={productRankingData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
