import React, { useState } from 'react'
import { Card, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import { StyleNameProduct, WrapperCardStyle, WrapperPrice, WrapperReportText, WrapperContent, WrapperStyledTextSell } from './style'
import { StarFilled, ShoppingCartOutlined } from '@ant-design/icons'
import { useCart } from '../../context/useCart'
const CardComponent = ({ product }) => {
  const { _id, id, name, image, price, rating, sold, discount } = product || {}
  const { addToCart } = useCart()
  const productId = _id || id
  const [showGreenEffect, setShowGreenEffect] = useState(false)
  const displayImage = image ? (image.startsWith('http') ? image : `http://localhost:5000/${image}`) : ''
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }
  const formatSold = (sold) => {
    if (sold >= 1000) {
      return `${(sold / 1000).toFixed(1)}k+`
    }
    return sold
  }
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    message.success('Đã thêm vào giỏ hàng!');
    setShowGreenEffect(true);
    setTimeout(() => {
      setShowGreenEffect(false);
    }, 3000);
  }
  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/product-details/${productId}`} style={{ textDecoration: 'none' }}>
        <WrapperCardStyle
            hoverable
            style={{ height: '100%' }}
            cover={<img alt={name} src={displayImage} style={{ height: '200px', objectFit: 'cover', width: '100%' }}/>}
            >
                <WrapperContent>
                    <StyleNameProduct>{name}</StyleNameProduct>
                    <WrapperReportText>
                        <span style={{marginRight: '4px'}}>
                            <span>{rating}</span>
                            <StarFilled style={{color: '#faad14', fontSize: '10px'}} />
                        </span>
                        <WrapperStyledTextSell>| Đã bán {formatSold(sold)}</WrapperStyledTextSell>
                    </WrapperReportText>
                    <WrapperPrice>
                      <span style={{marginRight: '8px'}}>{formatPrice(price)}</span>
                      {discount && (
                        <span style={{
                          fontSize: '12px',
                          color: '#ff6b6b',
                          textDecoration: 'line-through'
                        }}>
                          {formatPrice(discount)}
                        </span>
                      )}
                    </WrapperPrice>
                </WrapperContent>
        </WrapperCardStyle>
      </Link>
      {}
      <Button
        type="primary"
        icon={<ShoppingCartOutlined />}
        size="small"
        onClick={handleAddToCart}
                 style={{
           position: 'absolute',
           top: '10px',
           right: '10px',
           borderRadius: '50%',
           width: '36px',
           height: '36px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           background: showGreenEffect ? '#52c41a' : '#ff4d4f',
           border: 'none',
           boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
           zIndex: 10
         }}
         title={showGreenEffect ? 'Đã thêm vào giỏ hàng!' : 'Thêm vào giỏ hàng'}
      />
    </div>
    )
}
export default CardComponent