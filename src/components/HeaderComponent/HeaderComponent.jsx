import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input, Badge, Dropdown, message } from 'antd';
import { useCart } from '../../context/useCart';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ShopOutlined,
  TeamOutlined,
  DashboardOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Logo from '../../assets/images/Logo.webp';
const HeaderComponent = () => {
  const [isLogin, setIsLogin] = useState(localStorage.getItem('isLogin') === 'true');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  useEffect(() => {
    console.log(' HeaderComponent - localStorage isLogin:', localStorage.getItem('isLogin'));
    console.log(' HeaderComponent - localStorage userInfo:', localStorage.getItem('userInfo'));
    console.log(' HeaderComponent - localStorage userRole:', localStorage.getItem('userRole'));
    const storedIsLogin = localStorage.getItem('isLogin') === 'true';
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const storedUserRole = localStorage.getItem('userRole');
    console.log(' HeaderComponent - Stored values:', { storedIsLogin, storedUserInfo, storedUserRole });
    setIsLogin(storedIsLogin);
    setUserInfo(storedUserInfo);
    setUserRole(storedUserRole);
  }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      console.log(' HeaderComponent - Storage changed, updating state...');
      const newIsLogin = localStorage.getItem('isLogin') === 'true';
      const newUserRole = localStorage.getItem('userRole');
      const newUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      console.log(' HeaderComponent - New values:', { newIsLogin, newUserRole, newUserInfo });
      setIsLogin(newIsLogin);
      setUserRole(newUserRole);
      setUserInfo(newUserInfo);
    };
    window.addEventListener('storage', handleStorageChange);
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'isLogin' || key === 'userInfo' || key === 'userRole') {
        console.log(' HeaderComponent - localStorage.setItem called with:', key, value);
        setTimeout(handleStorageChange, 100); 
      }
    };
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);
  useEffect(() => {
    if (location.pathname === '/products') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.search]);
  const handleSearch = (value) => {
    if (value.trim()) {
      if (window.location.pathname === '/products') {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('search', value);
        navigate(`/products?${currentParams.toString()}`);
      } else {
        navigate(`/products?search=${encodeURIComponent(value)}`);
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRole');
    setIsLogin(false);
    setUserInfo({});
    setUserRole(null);
    message.success('Đăng xuất thành công!');
    navigate('/');
  };
  const getUserName = () => {
    try {
      console.log(' HeaderComponent - userInfo:', userInfo);
      console.log(' HeaderComponent - userInfo.hoTen:', userInfo?.hoTen);
      console.log(' HeaderComponent - userInfo.username:', userInfo?.username);
      console.log(' HeaderComponent - userInfo.email:', userInfo?.email);
      if (userInfo && userInfo.hoTen) {
        console.log(' HeaderComponent - Using hoTen:', userInfo.hoTen);
        return userInfo.hoTen;
      }
      if (userInfo && userInfo.email) {
        const emailPrefix = userInfo.email.split('@')[0];
        console.log(' HeaderComponent - Using email prefix:', emailPrefix);
        return emailPrefix;
      }
      if (userInfo && userInfo.username) {
        console.log(' HeaderComponent - Using username:', userInfo.username);
        return userInfo.username;
      }
      console.log(' HeaderComponent - Falling back to Admin');
      return 'Admin';
    } catch (error) {
      console.log('Error getting username:', error);
      return 'Admin';
    }
  };
  const accountMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin tài khoản',
      onClick: () => {
        navigate('/profile');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      },
    },
    ...(userRole === 'admin'
      ? [
          {
            key: 'admin-dashboard',
            icon: <DashboardOutlined />,
            label: 'Thống kê',
            onClick: () => {
              navigate('/admin');
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
            },
          },
          {
            key: 'admin-products',
            icon: <ShopOutlined />,
            label: 'Quản lý sản phẩm',
            onClick: () => {
              navigate('/admin/products');
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
            },
          },
          {
            key: 'admin-accounts',
            icon: <TeamOutlined />,
            label: 'Quản lý tài khoản',
            onClick: () => {
              navigate('/admin/accounts');
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
            },
          },
        ]
      : []),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];
  const cartMenuItems = [
    {
      key: 'cart',
      icon: <ShoppingCartOutlined />,
      label: 'Giỏ hàng',
      onClick: () => {
        if (!isLogin) {
          message.warning('Vui lòng đăng nhập để xem giỏ hàng!');
          sessionStorage.setItem('fromCart', 'true');
          navigate('/signin');
        } else {
          navigate('/cart');
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        }
      },
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng của tôi',
      onClick: () => {
        if (!isLogin) {
          message.warning('Vui lòng đăng nhập để xem đơn hàng!');
          sessionStorage.setItem('fromOrders', 'true');
          navigate('/signin');
        } else {
          navigate('/orders');
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        }
      },
    },
  ];
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
      padding: '0',
      width: '100%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      {}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link 
            to='/' 
            style={{ textDecoration: 'none' }}
            onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)}
          >
            <img
              src={Logo}
              alt='Logo'
              style={{
                height: '50px',
                objectFit: 'contain',
              }}
            />
          </Link>
        </div>
        <div style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
      style={{ 
        width: '100%', 
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isLogin ? (
            <Dropdown
              menu={{ items: accountMenuItems }}
              placement='bottomRight'
              trigger={['click']}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '6px',
                color: '#fff'
              }}
              >
                <UserOutlined style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {getUserName()}
                </span>
                <CaretDownOutlined style={{ fontSize: '12px' }} />
                </div>
            </Dropdown>
          ) : (
            <Link to="/signin" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '6px'
            }}
            >
              <UserOutlined style={{ fontSize: '18px' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
               Đăng nhập/Đăng Ký
              </span>
            </Link>
          )}
          {}
          <Dropdown
            menu={{ items: cartMenuItems }}
            placement='bottomRight'
            trigger={['click']}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'background-color 0.3s',
              color: '#fff'
            }}
            >
              <Badge count={cartCount} size='small'>
                <ShoppingCartOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </Badge>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                Giỏ hàng<br/>Đơn hàng của tôi
              </span>
            </div>
          </Dropdown>
        </div>
            </div>
          </div>
  );
};
export default HeaderComponent;