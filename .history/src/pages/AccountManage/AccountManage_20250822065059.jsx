import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Switch, 
  Space, 
  Avatar, 
  Dropdown, 
  Badge,
  Row,
  Col,
  Typography,
  Statistic,
  notification,
  Modal,
  Form
} from 'antd'
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  SearchOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  LockOutlined,
  HomeOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import {
  UsernameText,
  FullNameText,
  EmailText,
  PhoneText,
  DateText
} from './style'
const { Title } = Typography
const { Search } = Input
const { Option } = Select
const { Password } = Input
const AccountManagePage = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [form] = Form.useForm()
  const [passwordVisible, setPasswordVisible] = useState(false)
  useEffect(() => {
    loadAccounts()
  }, [])
  const loadAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/taikhoan')
      if (response.ok) {
        const data = await response.json()
        console.log(' AccountManage - Loaded accounts from API:', data)
        setAccounts(data)
      } else {
        console.log(' AccountManage - API failed, no accounts loaded')
        setAccounts([])
      }
    } catch (error) {
      console.log(' AccountManage - Error loading accounts:', error)
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }
  const getStats = () => {
    const total = accounts.length
    const adminCount = accounts.filter(acc => acc.vaiTro === 'admin').length
    const userCount = accounts.filter(acc => acc.vaiTro === 'user').length
    const activeCount = accounts.filter(acc => acc.trangThai).length
    return { total, adminCount, userCount, activeCount }
  }
  const getFilteredAccounts = () => {
    let filtered = accounts
    if (searchText) {
      filtered = filtered.filter(acc => 
        acc.username.toLowerCase().includes(searchText.toLowerCase()) ||
        acc.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    if (roleFilter !== 'all') {
      filtered = filtered.filter(acc => acc.vaiTro === roleFilter)
    }
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(acc => acc.trangThai === isActive)
    }
    return filtered
  }
  const handleRoleChange = async (accountId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/taikhoan/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaiTro: newRole })
      })
      if (response.ok) {
        setAccounts(prev => prev.map(acc => 
          acc._id === accountId ? { ...acc, vaiTro: newRole } : acc
        ))
        notification.success({ message: 'Cập nhật vai trò thành công' })
      }
    } catch {
      notification.error({ message: 'Lỗi cập nhật vai trò' })
    }
  }
  const handleStatusChange = async (accountId, newStatus) => {
    try {
      const response = await fetch(`http:
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trangThai: newStatus })
      })
      if (response.ok) {
        setAccounts(prev => prev.map(acc => 
          acc._id === accountId ? { ...acc, trangThai: newStatus } : acc
        ))
        notification.success({ message: 'Cập nhật trạng thái thành công' })
      }
    } catch {
      notification.error({ message: 'Lỗi cập nhật trạng thái' })
    }
  }
  const handleDelete = async (accountId) => {
    try {
      const response = await fetch(`http:
        method: 'DELETE'
      })
      if (response.ok) {
        setAccounts(prev => prev.filter(acc => acc._id !== accountId))
        notification.success({ message: 'Xóa tài khoản thành công' })
      }
    } catch {
      notification.error({ message: 'Lỗi xóa tài khoản' })
    }
  }
  const stats = getStats()
  const filteredAccounts = getFilteredAccounts()
  const columns = [
         {
       title: 'Tên đăng nhập',
       dataIndex: 'username',
       key: 'username',
       render: (username) => (
         <Space>
           <Avatar icon={<UserOutlined />} size="small" />
                    <UsernameText title={username}>
           {username}
         </UsernameText>
         </Space>
       )
     },
         {
       title: 'Họ và tên',
       dataIndex: 'hoTen',
       key: 'hoTen',
       render: (hoTen) => (
         <FullNameText title={hoTen}>
           {hoTen}
         </FullNameText>
       )
     },
         {
       title: 'Email',
       dataIndex: 'email',
       key: 'email',
       render: (email) => (
         <Space>
           <MailOutlined />
           <EmailText title={email}>
             {email}
           </EmailText>
         </Space>
       )
     },
         {
       title: 'Số điện thoại',
       dataIndex: 'soDienThoai',
       key: 'soDienThoai',
       render: (phone) => (
         <Space>
           <PhoneOutlined />
           <PhoneText title={phone}>
             {phone}
           </PhoneText>
         </Space>
       )
     },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      render: (role, record) => (
        <Select
          value={role}
          onChange={(value) => handleRoleChange(record._id, value)}
          style={{ width: 100 }}
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record._id, checked)}
          checkedChildren="Hoạt"
          unCheckedChildren="Không"
        />
      )
    },
         {
       title: 'Ngày tạo',
       dataIndex: 'ngayTao',
       key: 'ngayTao',
       render: (date) => (
         <DateText>
           {new Date(date).toLocaleDateString('vi-VN')}
         </DateText>
       )
     },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </Space>
      )
    }
  ]
  const handleEdit = (account) => {
    setIsEditMode(true)
    setEditingAccount(account)
    form.setFieldsValue({
      username: account.username,
      hoTen: account.hoTen,
      email: account.email,
      soDienThoai: account.soDienThoai,
      diaChi: account.diaChi,
      vaiTro: account.vaiTro,
      trangThai: account.trangThai
    })
    setIsModalVisible(true)
  }
  const handleAddAccount = () => {
    setIsEditMode(false)
    setEditingAccount(null)
    form.resetFields()
    setIsModalVisible(true)
  }
  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setEditingAccount(null)
    setIsEditMode(false)
  }
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (isEditMode && editingAccount) {
        const response = await fetch(`http:
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        })
        if (response.ok) {
          const updatedAccount = await response.json()
          setAccounts(prev => prev.map(acc => 
            acc._id === editingAccount._id ? { ...acc, ...updatedAccount } : acc
          ))
          notification.success({ message: 'Cập nhật tài khoản thành công' })
          handleModalCancel()
        }
      } else {
        const response = await fetch('http:
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        })
        if (response.ok) {
          const newAccount = await response.json()
          setAccounts(prev => [...prev, newAccount])
          notification.success({ message: 'Thêm tài khoản thành công' })
          handleModalCancel()
        }
      }
    } catch (error) {
      console.log('Form validation error:', error)
    }
  }
  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {}
        <Title level={2} style={{ marginBottom: 24 }}>
          Quản lý tài khoản
        </Title>
        {}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng số tài khoản"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Admin"
                value={stats.adminCount}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="User"
                value={stats.userCount}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={stats.activeCount}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
        {}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Search
                placeholder="Tìm kiếm tài khoản..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={4}>
              <Select
                value={roleFilter}
                onChange={setRoleFilter}
                style={{ width: '100%' }}
                placeholder="Tất cả vai trò"
              >
                <Option value="all">Tất cả vai trò</Option>
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
              </Select>
            </Col>
            <Col xs={24} sm={4}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
                placeholder="Tất cả trạng thái"
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleAddAccount}
              >
                + Thêm tài khoản mới
              </Button>
            </Col>
          </Row>
        </Card>
        {}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredAccounts}
            rowKey="_id"
            loading={loading}
            pagination={{
              total: filteredAccounts.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} tài khoản`
            }}
          />
                 </Card>
       </div>
       {}
               <Modal
          title={isEditMode ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={600}
          okText={isEditMode ? "Cập nhật" : "Thêm mới"}
          cancelText="Hủy"
          style={{ borderRadius: 12 }}
          bodyStyle={{ padding: '20px 0' }}
          okButtonProps={{ 
            style: { 
              backgroundColor: '#1890ff', 
              borderColor: '#1890ff',
              borderRadius: 6,
              height: 36,
              fontSize: 14,
              fontWeight: 500
            } 
          }}
          cancelButtonProps={{ 
            style: { 
              borderColor: '#d9d9d9',
              borderRadius: 6,
              height: 36,
              fontSize: 14,
              fontWeight: 500
            } 
          }}
        >
                   <Form
            form={form}
            layout="vertical"
            style={{ marginTop: 16, padding: '0 20px' }}
          >
                                                                                               <Row gutter={16}>
                <Col span={11}>
                  <Form.Item
                    name="username"
                    label={
                      <span style={{ fontWeight: 500, color: '#333' }}>
                        Tên đăng nhập <span style={{ color: '#ff4d4f' }}>*</span>
                      </span>
                    }
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Nhập tên đăng nhập"
                      disabled={isEditMode}
                      size="large"
                      style={{ 
                        borderRadius: 8,
                        border: '1px solid #d9d9d9',
                        height: 36,
                        fontSize: 14
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    name="email"
                    label={
                      <span style={{ fontWeight: 500, color: '#333' }}>
                        Email <span style={{ color: '#ff4d4f' }}>*</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Nhập email"
                      size="large"
                      style={{ 
                        borderRadius: 8,
                        border: '1px solid #d9d9d9',
                        height: 36,
                        fontSize: 14
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
                                                                                               <Row gutter={16}>
                <Col span={11}>
                  <Form.Item
                    name="hoTen"
                    label={
                      <span style={{ fontWeight: 500, color: '#333' }}>
                        Họ và tên <span style={{ color: '#ff4d4f' }}>*</span>
                      </span>
                    }
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      size="large"
                      style={{ 
                        borderRadius: 8,
                        border: '1px solid #d9d9d9',
                        height: 36,
                        fontSize: 14
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    name="soDienThoai"
                    label={
                      <span style={{ fontWeight: 500, color: '#333' }}>
                        Số điện thoại
                      </span>
                    }
                  >
                    <Input
                      prefix={<PhoneOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Nhập số điện thoại"
                      size="large"
                      style={{ 
                        borderRadius: 8,
                        border: '1px solid #d9d9d9',
                        height: 36,
                        fontSize: 14
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
                                               <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="diaChi"
                  label={
                    <span style={{ fontWeight: 500, color: '#333' }}>
                      Địa chỉ
                    </span>
                  }
                >
                  <Input
                    prefix={<HomeOutlined style={{ color: '#1890ff' }} />}
                    placeholder="Nhập địa chỉ"
                    size="large"
                    style={{ 
                      borderRadius: 8,
                      border: '1px solid #d9d9d9',
                      height: 36,
                      fontSize: 14
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
                                                   {!isEditMode && (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="matKhau"
                      label={
                        <span style={{ fontWeight: 500, color: '#333' }}>
                          Mật khẩu <span style={{ color: '#ff4d4f' }}>*</span>
                        </span>
                      }
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                      <Input
                        prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        size="large"
                        style={{ 
                          borderRadius: 8,
                          border: '1px solid #d9d9d9',
                          height: 36,
                          fontSize: 14
                        }}
                        suffix={
                          <span
                            style={{ 
                              cursor: 'pointer',
                              color: '#666',
                              marginRight: 8
                            }}
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          </span>
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {!isEditMode && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="vaiTro"
                      label={
                        <span style={{ fontWeight: 500, color: '#333' }}>
                          Vai trò <span style={{ color: '#ff4d4f' }}>*</span>
                        </span>
                      }
                      rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                      <Select 
                        placeholder="Chọn vai trò"
                        size="large"
                        style={{ 
                          borderRadius: 8,
                          border: '1px solid #d9d9d9',
                          height: 36,
                          fontSize: 14
                        }}
                      >
                        <Option value="user">User</Option>
                        <Option value="admin">Admin</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="trangThai"
                      label={
                        <span style={{ fontWeight: 500, color: '#333' }}>
                          Trạng thái
                        </span>
                      }
                      valuePropName="checked"
                    >
                      <Switch
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Không hoạt động"
                        style={{ 
                          backgroundColor: '#1890ff',
                          borderRadius: 20
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
                                                   {isEditMode && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="vaiTro"
                      label={
                        <span style={{ fontWeight: 500, color: '#333' }}>
                          Vai trò <span style={{ color: '#ff4d4f' }}>*</span>
                        </span>
                      }
                      rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                      <Select 
                        placeholder="Chọn vai trò"
                        size="large"
                        style={{ 
                          borderRadius: 8,
                          border: '1px solid #d9d9d9',
                          height: 36,
                          fontSize: 14
                        }}
                      >
                        <Option value="user">User</Option>
                        <Option value="admin">Admin</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="trangThai"
                      label={
                        <span style={{ fontWeight: 500, color: '#333' }}>
                          Trạng thái
                        </span>
                      }
                      valuePropName="checked"
                    >
                      <Switch
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Không hoạt động"
                        style={{ 
                          backgroundColor: '#1890ff',
                          borderRadius: 20
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
         </Form>
       </Modal>
     </div>
   )
 }
export default AccountManagePage
