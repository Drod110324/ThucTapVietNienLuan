import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  DatePicker,
  Select,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  EyeOutlined,
  DownloadOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardPage = () => {
  const [dateRange, setDateRange] = useState(null);
  const [reportType, setReportType] = useState('daily');

  // Mock data for KPIs
  const kpiData = [
    {
      title: 'Tổng doanh thu',
      value: '125,000,000',
      suffix: 'VNĐ',
      prefix: '$',
      trend: '+12.5%',
      trendUp: true,
      icon: <DollarOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Tổng đơn hàng',
      value: '156',
      trend: '+8.3%',
      trendUp: true,
      icon: <ShoppingOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Tổng khách hàng',
      value: '82',
      icon: <UserOutlined />,
      color: '#722ed1',
    },
    {
      title: 'Tổng sản phẩm',
      value: '16',
      icon: <ShopOutlined />,
      color: '#fa8c16',
    },
  ];

  // Mock data for revenue chart
  const revenueData = [
    { period: 'T1', revenue: 85000000 },
    { period: 'T2', revenue: 92000000 },
    { period: 'T3', revenue: 78000000 },
    { period: 'T4', revenue: 105000000 },
    { period: 'T5', revenue: 125000000 },
    { period: 'T6', revenue: 98000000 },
  ];

  // Mock data for best-selling products
  const bestSellingProducts = [
    {
      name: 'Canon EOS R5',
      revenue: '1.200.000.000',
      quantity: '15 chiếc đã bán',
      growth: '+25%',
      trendUp: true,
    },
    {
      name: 'Sony A7 IV',
      revenue: '540.000.000',
      quantity: '12 chiếc đã bán',
      growth: '+18%',
      trendUp: true,
    },
    {
      name: 'Nikon Z6 III',
      revenue: '950.000.000',
      quantity: '10 chiếc đã bán',
      growth: '+32%',
      trendUp: true,
    },
    {
      name: 'Fujifilm X-T5',
      revenue: '320.000.000',
      quantity: '8 chiếc đã bán',
      growth: '-5%',
      trendUp: false,
    },
    {
      name: 'Canon EOS R6 Mark II',
      revenue: '476.000.000',
      quantity: '7 chiếc đã bán',
      growth: '+15%',
      trendUp: true,
    },
  ];

  // Mock data for recent orders
  const recentOrders = [
    {
      key: '1',
      orderId: '#001',
      customer: 'Nguyễn Văn A',
      product: 'Canon EOS R5, Ống kính...',
      total: '85.000.000 ₫',
      status: 'Hoàn thành',
      date: '15/1/2024',
      statusColor: 'success',
    },
    {
      key: '2',
      orderId: '#002',
      customer: 'Trần Thị B',
      product: 'Sony A7 IV',
      total: '45.000.000 ₫',
      status: 'Đang xử lý',
      date: '14/1/2024',
      statusColor: 'processing',
    },
    {
      key: '3',
      orderId: '#003',
      customer: 'Lê Văn C',
      product: 'Nikon Z6 III, Ống kính 7...',
      total: '95.000.000 ₫',
      status: 'Đã giao hàng',
      date: '13/1/2024',
      statusColor: 'warning',
    },
    {
      key: '4',
      orderId: '#004',
      customer: 'Phạm Thị D',
      product: 'Fujifilm X-T5',
      total: '32.000.000 ₫',
      status: 'Hoàn thành',
      date: '12/1/2024',
      statusColor: 'success',
    },
    {
      key: '5',
      orderId: '#005',
      customer: 'Hoàng Văn E',
      product: 'Canon EOS R6 Mark II',
      total: '68.000.000 ₫',
      status: 'Đang xử lý',
      date: '11/1/2024',
      statusColor: 'processing',
    },
  ];

  // Mock data for product ranking
  const productRanking = [
    {
      key: '1',
      product: 'Canon EOS R5',
      quantity: '15 chiếc',
      revenue: '1.200.000.000 ₫',
      growth: '+25%',
      trendUp: true,
    },
    {
      key: '2',
      product: 'Sony A7 IV',
      quantity: '12 chiếc',
      revenue: '540.000.000 ₫',
      growth: '+18%',
      trendUp: true,
    },
    {
      key: '3',
      product: 'Nikon Z6 III',
      quantity: '10 chiếc',
      revenue: '950.000.000 ₫',
      growth: '+32%',
      trendUp: true,
    },
    {
      key: '4',
      product: 'Fujifilm X-T5',
      quantity: '8 chiếc',
      revenue: '320.000.000 ₫',
      growth: '-5%',
      trendUp: false,
    },
    {
      key: '5',
      product: 'Canon EOS R6 Mark II',
      quantity: '7 chiếc',
      revenue: '476.000.000 ₫',
      growth: '+15%',
      trendUp: true,
    },
  ];

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      width: 200,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => (
        <span style={{ color: record.statusColor === 'success' ? '#52c41a' : record.statusColor === 'processing' ? '#1890ff' : '#fa8c16' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
  ];

  const rankingColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      width: 200,
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 150,
    },
    {
      title: 'Tăng trưởng',
      dataIndex: 'growth',
      key: 'growth',
      width: 100,
      render: (growth, record) => (
        <span style={{ color: record.trendUp ? '#52c41a' : '#ff4d4f' }}>
          {growth}
        </span>
      ),
    },
  ];

  const handleViewReport = () => {
    console.log('View report:', { dateRange, reportType });
  };

  const handleExportExcel = () => {
    console.log('Export Excel:', { dateRange, reportType });
  };

  return (
    <WrapperContainer>
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Dashboard - Thống kê & Báo cáo
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Tổng quan về doanh thu, đơn hàng và hiệu suất kinh doanh
          </Text>
        </div>

        {/* Filter Section */}
        <Card style={{ marginBottom: '24px', backgroundColor: '#f5f5f5' }}>
          <Row gutter={16} align="middle">
            <Col>
              <Text strong>Khoảng thời gian:</Text>
            </Col>
            <Col>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                style={{ width: 280 }}
              />
            </Col>
            <Col>
              <Text strong>Loại báo cáo:</Text>
            </Col>
            <Col>
              <Select
                value={reportType}
                onChange={setReportType}
                style={{ width: 150 }}
              >
                <Option value="daily">Hàng ngày</Option>
                <Option value="weekly">Hàng tuần</Option>
                <Option value="monthly">Hàng tháng</Option>
                <Option value="yearly">Hàng năm</Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={handleViewReport}
                >
                  Xem báo cáo
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExportExcel}
                >
                  Xuất Excel
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* KPI Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          {kpiData.map((kpi, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card>
                <Statistic
                  title={kpi.title}
                  value={kpi.value}
                  prefix={kpi.prefix}
                  suffix={kpi.suffix}
                  valueStyle={{ color: kpi.color, fontSize: '24px' }}
                  prefix={kpi.icon}
                />
                {kpi.trend && (
                  <div style={{ marginTop: '8px' }}>
                    <Text
                      style={{
                        color: kpi.trendUp ? '#52c41a' : '#ff4d4f',
                        fontSize: '14px',
                      }}
                    >
                      {kpi.trendUp ? <TrendingUpOutlined /> : <TrendingDownOutlined />}
                      {' '}{kpi.trend}
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        {/* Revenue Chart */}
        <Card
          title={
            <Space>
              <BarChartOutlined />
              Biểu đồ doanh thu
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px 0' }}>
            {revenueData.map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '60px',
                    height: `${(item.revenue / 125000000) * 200}px`,
                    backgroundColor: '#1890ff',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '8px',
                  }}
                />
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  {item.period}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  {item.revenue.toLocaleString()} ₫
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
                <Space>
                  <CalendarOutlined />
                  Đơn hàng gần đây
                </Space>
              }
            >
              <Table
                columns={orderColumns}
                dataSource={recentOrders}
                pagination={false}
                size="small"
                scroll={{ x: 600 }}
              />
            </Card>
          </Col>

          {/* Product Ranking */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <BarChartOutlined />
                  Bảng xếp hạng sản phẩm
                </Space>
              }
            >
              <Table
                columns={rankingColumns}
                dataSource={productRanking}
                pagination={false}
                size="small"
                scroll={{ x: 500 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </WrapperContainer>
  );
};

const WrapperContainer = styled.div`
  background-color: #f0f2f5;
  min-height: 100vh;
`;

export default DashboardPage;
