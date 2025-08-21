import React, { useState } from 'react';
import { Card, Button, InputNumber, Empty, message, Modal, Form, Input, Select, Radio } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, LeftOutlined, CloseOutlined, CreditCardOutlined, BankOutlined, WalletOutlined, CarOutlined } from '@ant-design/icons';
import { useCart } from '../../context/useCart';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [form] = Form.useForm();
  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      message.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    } else {
      updateQuantity(productId, quantity);
    }
  };
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    message.success('Đã xóa sản phẩm khỏi giỏ hàng!');
  };
  const handleClearCart = () => {
    clearCart();
    message.success('Đã xóa tất cả sản phẩm!');
  };
  const showCheckoutModal = () => {
    setIsCheckoutModalVisible(true);
  };
  const handleCheckoutCancel = () => {
    setIsCheckoutModalVisible(false);
    form.resetFields();
  };
  const handleCheckoutSubmit = (values) => {
    console.log('Checkout form values:', values);
    message.success('Đặt hàng thành công!');
    setIsCheckoutModalVisible(false);
    form.resetFields();
    clearCart();
    navigate('/orders');
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  if (cartItems.length === 0) {
    return (
      <CartPageContainer>
        <Empty
          image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
          description="Giỏ hàng của bạn đang trống"
        >
          <Button type="primary" size="large">
            Tiếp tục mua sắm
          </Button>
        </Empty>
      </CartPageContainer>
    );
  }
  return (
    <CartPageContainer>
      {}
      <CartHeader style={{ backgroundColor: '#f0f2f5' }}>
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ color: '#333', fontSize: '16px', backgroundColor: '#f2f2f2' }}
        >
          Quay lại
        </Button>
        <h1>Giỏ hàng ({cartItems.length} sản phẩm)</h1>
      </CartHeader>
      <CartContent>
        {}
        <ProductSection>
          {}
          <TableHeader>
            <div className="col-product">Sản phẩm</div>
            <div className="col-price">Đơn giá</div>
            <div className="col-quantity">Số lượng</div>
            <div className="col-total">Thành tiền</div>
            <div className="col-action">Thao tác</div>
          </TableHeader>
          {}
          {cartItems.map((item) => (
            <ProductRow key={item._id}>
              <div className="col-product">
                <div className="product-info">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="product-image"
                  />
                  <div className="product-details">
                    <h3>{item.name}</h3>
                    <p className="stock-info">Còn lại: {item.stock} sản phẩm</p>
                  </div>
                </div>
              </div>
              <div className="col-price">
                <span className="price">{formatCurrency(item.price)}</span>
              </div>
              <div className="col-quantity">
                <InputNumber
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(item._id, value)}
                  size="small"
                />
              </div>
              <div className="col-total">
                <span className="total-price">{formatCurrency(item.price * item.quantity)}</span>
              </div>
              <div className="col-action">
                <Button
                  type="link"
                  danger
                  onClick={() => handleRemoveItem(item._id)}
                  style={{ padding: 0 }}
                >
                  Xóa
                </Button>
              </div>
            </ProductRow>
          ))}
          {}
          <ActionButtons>
            <Button onClick={handleClearCart} style={{ color: '#ff4d4f' }}>
              Xóa tất cả
            </Button>
            <Button type="link" onClick={() => navigate('/products')}>
              Tiếp tục mua sắm
            </Button>
          </ActionButtons>
        </ProductSection>
        {}
        <SummarySection>
          <SummaryCard>
            <h3>Tổng đơn hàng</h3>
            <SummaryRow>
              <span>Tạm tính:</span>
              <span>{formatCurrency(getCartTotal())}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </SummaryRow>
            <Divider />
            <SummaryTotal>
              <span>Tổng cộng:</span>
              <span className="total-amount">{formatCurrency(getCartTotal())}</span>
            </SummaryTotal>
            <CheckoutButton type="primary" size="large" block onClick={showCheckoutModal}>
              Tiến hành thanh toán
            </CheckoutButton>
            <CheckoutNote>
              Bằng việc tiến hành thanh toán, bạn đồng ý với các điều khoản mua hàng
            </CheckoutNote>
          </SummaryCard>
        </SummarySection>
      </CartContent>
      {}
      <Modal
        title="Thông tin thanh toán"
        open={isCheckoutModalVisible}
        onCancel={handleCheckoutCancel}
        footer={null}
        width={700}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCheckoutSubmit}
          style={{ padding: '10px 0' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {}
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '16px' }}>
                Thông tin giao hàng
              </h3>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                name="province"
                label="Tỉnh/Thành phố"
                rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                style={{ marginBottom: '16px' }}
              >
                <Select placeholder="Chọn tỉnh/thành phố">
                  <Select.Option value="hanoi">Hà Nội</Select.Option>
                  <Select.Option value="hcm">TP. Hồ Chí Minh</Select.Option>
                  <Select.Option value="danang">Đà Nẵng</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="district"
                label="Quận/Huyện"
                rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
                style={{ marginBottom: '16px' }}
              >
                <Select placeholder="Chọn quận/huyện">
                  <Select.Option value="caugiai">Cầu Giấy</Select.Option>
                  <Select.Option value="dongda">Đống Đa</Select.Option>
                  <Select.Option value="haidong">Hai Bà Trưng</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ chi tiết"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input.TextArea 
                  placeholder="Nhập địa chỉ chi tiết" 
                  rows={2}
                />
              </Form.Item>
              <Form.Item
                name="note"
                label="Ghi chú"
                style={{ marginBottom: '0' }}
              >
                <Input.TextArea 
                  placeholder="Ghi chú (không bắt buộc)" 
                  rows={2}
                />
              </Form.Item>
            </div>
            {}
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '16px' }}>
                Phương thức thanh toán
              </h3>
              <Form.Item
                name="paymentMethod"
                initialValue="cod"
              >
                <Radio.Group style={{ width: '100%' }}>
                  <Radio value="cod" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px' }}>
                    <CarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    COD - Thanh toán khi nhận hàng
                  </Radio>
                  <Radio value="bank" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px' }}>
                    <BankOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                    Chuyển khoản - Qua tài khoản ngân hàng
                  </Radio>
                  <Radio value="credit" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px' }}>
                    <CreditCardOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                    Thẻ tín dụng - Visa, Mastercard
                  </Radio>
                  <Radio value="ewallet" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px' }}>
                    <WalletOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                    Ví điện tử - Momo, ZaloPay, VNPay
                  </Radio>
                </Radio.Group>
              </Form.Item>
              {}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px',
                marginTop: '20px'
              }}>
                <h4 style={{ marginBottom: '12px', color: '#333' }}>Tổng đơn hàng</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Phí vận chuyển:</span>
                  <span style={{ color: '#52c41a' }}>Miễn phí</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '16px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  <span>Tổng cộng:</span>
                  <span style={{ color: '#ff4d4f', fontSize: '18px' }}>
                    {formatCurrency(getCartTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{ 
                background: '#ff6b6b', 
                borderColor: '#ff6b6b',
                height: '40px',
                fontSize: '14px',
                fontWeight: '600'
              }}
              block
            >
              Đặt hàng ngay
            </Button>
            <Button 
              onClick={handleCheckoutCancel}
              style={{ 
                height: '40px',
                fontSize: '14px'
              }}
              block
            >
              Hủy
            </Button>
          </div>
        </Form>
      </Modal>
    </CartPageContainer>
  );
};
const CartPageContainer = styled.div`
  min-height: 100vh;
  padding: 0;
`;
const CartHeader = styled.div`
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 16px;
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
`;
const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;
const ProductSection = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #666;
  font-size: 14px;
  .col-product { grid-column: 1; }
  .col-price { grid-column: 2; text-align: center; }
  .col-quantity { grid-column: 3; text-align: center; }
  .col-total { grid-column: 4; text-align: center; }
  .col-action { grid-column: 5; text-align: center; }
`;
const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  &:last-child {
    border-bottom: none;
  }
  .col-product {
    grid-column: 1;
    .product-info {
      display: flex;
      align-items: center;
      gap: 12px;
      .product-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
      }
      .product-details {
        h3 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          line-height: 1.4;
        }
        .stock-info {
          margin: 0;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  .col-price {
    grid-column: 2;
    text-align: center;
    .price {
      font-size: 14px;
      font-weight: 600;
      color: #ff4d4f;
    }
  }
  .col-quantity {
    grid-column: 3;
    text-align: center;
  }
  .col-total {
    grid-column: 4;
    text-align: center;
    .total-price {
      font-size: 14px;
      font-weight: 600;
      color: #ff4d4f;
    }
  }
  .col-action {
    grid-column: 5;
    text-align: center;
  }
`;
const ActionButtons = styled.div`
  padding: 16px 20px;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SummarySection = styled.div`
  align-self: start;
`;
const SummaryCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
`;
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
`;
const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 16px 0;
`;
const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  .total-amount {
    color: #ff4d4f;
    font-size: 18px;
  }
`;
const CheckoutButton = styled(Button)`
  background: #ff6b6b !important;
  border-color: #ff6b6b !important;
  height: 44px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  margin-bottom: 12px !important;
  &:hover {
    background: #ff5252 !important;
    border-color: #ff5252 !important;
  }
`;
const CheckoutNote = styled.p`
  margin: 0;
  font-size: 12px;
  color: #999;
  text-align: center;
  line-height: 1.4;
`;
export default CartPage;
