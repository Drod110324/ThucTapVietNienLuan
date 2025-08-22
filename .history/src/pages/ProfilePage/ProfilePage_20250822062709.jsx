import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Button, notification, Spin, Avatar, Row, Col, Divider, Typography, Space } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
const { Title, Text } = Typography
const ProfilePage = () => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [editing, setEditing] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    console.log(' ProfilePage - Component mounted')
    console.log(' ProfilePage - Current userInfo state:', userInfo)
    const quickLoad = () => {
      const raw = localStorage.getItem('userInfo')
      if (raw) {
        try {
          const user = JSON.parse(raw)
          console.log(' ProfilePage - Quick load user:', user)
          setUserInfo(user)
          form.setFieldsValue({
            hoTen: user.hoTen || user.name || user.username || '',
            email: user.email || '',
            soDienThoai: user.soDienThoai || user.phone || '',
            diaChi: user.diaChi || user.address || '',
          })
        } catch (error) {
          console.log(' ProfilePage - Quick load error:', error)
        }
      }
    }
    quickLoad()
    loadUserInfo()
  }, [])
  useEffect(() => {
    console.log(' ProfilePage - userInfo changed:', userInfo)
  }, [userInfo])
  const loadUserInfo = async () => {
    try {
      setLoading(true)
      const raw = localStorage.getItem('userInfo')
      console.log(' ProfilePage - localStorage raw:', raw)
      if (!raw) {
        notification.error({ message: 'Lỗi', description: 'Chưa đăng nhập' })
        navigate('/signin')
        return
      }
      const user = JSON.parse(raw)
      console.log(' ProfilePage - Parsed user:', user)
      setUserInfo(user)
      form.setFieldsValue({
        hoTen: user.hoTen || user.name || user.username || '',
        email: user.email || '',
        soDienThoai: user.soDienThoai || user.phone || '',
        diaChi: user.diaChi || user.address || '',
      })
      if (!user._id) {
        console.log(' ProfilePage - No _id, showing local data only')
        return
      }
      try {
        console.log(' ProfilePage - Fetching from API:', `http://localhost:5000/taikhoan/profile`);
        const res = await fetch(`http://localhost:5000/taikhoan/profile`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const updatedUser = await res.json()
          console.log(' ProfilePage - API response:', updatedUser)
          localStorage.setItem('userInfo', JSON.stringify(updatedUser))
          setUserInfo(updatedUser)
           form.setFieldsValue({
             hoTen: updatedUser.hoTen || updatedUser.name || '',
             email: updatedUser.email || '',
             soDienThoai: updatedUser.soDienThoai || updatedUser.phone || '',
             diaChi: updatedUser.diaChi || updatedUser.address || '',
           })
           console.log(' ProfilePage - Form values set:', {
             hoTen: updatedUser.hoTen || updatedUser.name || '',
             email: updatedUser.email || '',
             soDienThoai: updatedUser.soDienThoai || updatedUser.phone || '',
             diaChi: updatedUser.diaChi || updatedUser.address || '',
           })
        } else {
          console.log(' ProfilePage - API failed, using local data')
           setUserInfo(user)
           form.setFieldsValue({
             hoTen: user.hoTen || user.name || user.username || '',
             email: user.email || '',
             soDienThoai: user.soDienThoai || user.phone || '',
             diaChi: user.diaChi || user.address || '',
           })
          notification.warning({
            message: 'Cảnh báo',
            description: 'Không thể kết nối với database. Hiển thị thông tin local.',
            duration: 3
          })
        }
      } catch (error) {
        console.log(' ProfilePage - API error:', error)
         setUserInfo(user)
         form.setFieldsValue({
           hoTen: user.hoTen || user.name || user.username || '',
           email: user.email || '',
           soDienThoai: user.soDienThoai || user.phone || '',
           diaChi: user.diaChi || user.address || '',
         })
        notification.warning({
          message: 'Cảnh báo kết nối',
          description: 'Không thể kết nối với server. Hiển thị thông tin local.',
          duration: 3
        })
      }
    } catch (error) {
      console.log(' ProfilePage - General error:', error)
      notification.error({ message: 'Lỗi', description: 'Không thể tải thông tin người dùng' })
    } finally {
      setLoading(false)
    }
  }
  const onFinish = async values => {
    if (!userInfo?._id) {
      notification.error({ message: 'Lỗi', description: 'Thông tin người dùng không hợp lệ' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`http://localhost:5000/taikhoan/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await res.json()
      if (res.ok) {
        const updatedUser = { ...userInfo, ...result }
        localStorage.setItem('userInfo', JSON.stringify(updatedUser))
        setUserInfo(updatedUser)
        notification.success({ 
          message: 'Cập nhật thành công',
          description: 'Thông tin tài khoản đã được cập nhật trong database',
          duration: 3
        })
        setEditing(false)
        setTimeout(() => {
          loadUserInfo()
        }, 1000)
      } else {
        throw new Error(result.message || 'Cập nhật thất bại')
      }
    } catch (e) {
      notification.error({ 
        message: 'Lỗi cập nhật', 
        description: e.message || 'Không thể kết nối với database',
        duration: 4
      })
    } finally {
      setSaving(false)
    }
  }
  const getUserInitials = () => {
    if (userInfo?.hoTen) {
      return userInfo.hoTen.split(' ').map(name => name[0]).join('').toUpperCase()
    }
    if (userInfo?.name) {
      return userInfo.name.split(' ').map(name => name[0]).join('').toUpperCase()
    }
    if (userInfo?.email) {
      return userInfo.email.split('@')[0].substring(0, 2).toUpperCase()
    }
    return 'U'
  }
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, fontSize: 16 }}>
            Đang tải thông tin...
          </div>
        </div>
      </div>
    )
  }
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '24px 16px',
      backgroundColor: '#f5f5f5'
    }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
         <Row gutter={[24, 24]}>
          {}
          <Col xs={24} md={8}>
            <Card 
              style={{ 
                borderRadius: 16,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}
              bodyStyle={{ padding: 32, textAlign: 'center' }}
            >
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                style={{ 
                  backgroundColor: '#667eea',
                  fontSize: 48,
                  marginBottom: 24,
                  border: '4px solid #fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
              >
                {getUserInitials()}
              </Avatar>
                             <Title level={3} style={{ marginBottom: 8, color: '#333' }}>
                 {userInfo?.hoTen || userInfo?.name || userInfo?.username || 'Loading...'}
               </Title>
               <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
                 {userInfo?.email || 'Loading...'}
               </Text>
               <Divider />
               <Space direction="vertical" size="small" style={{ width: '100%' }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                   <PhoneOutlined style={{ color: '#667eea' }} />
                   <Text>{userInfo?.soDienThoai || userInfo?.phone || 'Chưa có số điện thoại'}</Text>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                   <HomeOutlined style={{ color: '#667eea' }} />
                   <Text>{userInfo?.diaChi || userInfo?.address || 'Chưa có địa chỉ'}</Text>
                 </div>
               </Space>
              <Divider />
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <PhoneOutlined style={{ color: '#667eea' }} />
                  <Text>{userInfo?.soDienThoai || 'Chưa có số điện thoại'}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <HomeOutlined style={{ color: '#667eea' }} />
                  <Text>{userInfo?.diaChi || 'Chưa có địa chỉ'}</Text>
                </div>
              </Space>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setEditing(!editing)}
                style={{ 
                  marginTop: 24,
                  borderRadius: 8,
                  height: 40,
                  background: editing ? '#ff4d4f' : '#667eea',
                  border: 'none'
                }}
              >
                {editing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
              </Button>
            </Card>
          </Col>
          {}
          <Col xs={24} md={16}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <EditOutlined style={{ color: '#667eea' }} />
                  <span>Chỉnh sửa thông tin</span>
                </div>
              }
              style={{ 
                borderRadius: 16,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Form 
                layout='vertical' 
                form={form} 
                onFinish={onFinish}
                disabled={!editing}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      name='hoTen' 
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <UserOutlined style={{ color: '#667eea' }} />
                          <span>Họ tên</span>
                        </div>
                      }
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                      <Input 
                        size="large"
                        placeholder="Nhập họ tên của bạn"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      name='email' 
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <MailOutlined style={{ color: '#667eea' }} />
                          <span>Email</span>
                        </div>
                      }
                    >
                      <Input 
                        size="large"
                        disabled
                        style={{ 
                          borderRadius: 8,
                          backgroundColor: '#f5f5f5'
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      name='soDienThoai' 
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <PhoneOutlined style={{ color: '#667eea' }} />
                          <span>Số điện thoại</span>
                        </div>
                      }
                    >
                      <Input 
                        size="large"
                        placeholder="Nhập số điện thoại"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      name='diaChi' 
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <HomeOutlined style={{ color: '#667eea' }} />
                          <span>Địa chỉ</span>
                        </div>
                      }
                    >
                      <Input 
                        size="large"
                        placeholder="Nhập địa chỉ"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {editing && (
                  <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
                    <Space>
                      <Button 
                        type='primary' 
                        htmlType='submit' 
                        loading={saving}
                        icon={<SaveOutlined />}
                        size="large"
                        style={{ 
                          borderRadius: 8,
                          background: '#52c41a',
                          border: 'none',
                          height: 44,
                          paddingLeft: 24,
                          paddingRight: 24
                        }}
                      >
                        Lưu thay đổi
                      </Button>
                      <Button 
                        onClick={() => setEditing(false)}
                        size="large"
                        style={{ 
                          borderRadius: 8,
                          height: 44,
                          paddingLeft: 24,
                          paddingRight: 24
                        }}
                      >
                        Hủy
                      </Button>
                    </Space>
                  </Form.Item>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
export default ProfilePage