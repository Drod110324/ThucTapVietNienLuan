import React, { useState, useRef } from 'react'
import { Row, Col, Image, Button, InputNumber, Carousel, message } from 'antd'
import { WrapperStyleSmallImage, WrapperStyleColImage, WrapperStyledNameProduct, WrapperPriceProduct, WrapperTextPriceProduct, WrapperStyledTextSell, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperBtnQualityProduct } from './style'
import { StarFilled, MinusOutlined, PlusOutlined, LeftOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { useCart } from '../../context/useCart'
const ProductDetailComponent = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carouselRef = useRef(null)
  const { addToCart, isInCart } = useCart()
  const { name, price, rating, sold, image, images, description, stock } = product || {}
  const processImageUrl = (imgUrl) => {
    if (!imgUrl) return null;
    return imgUrl.startsWith('http') ? imgUrl : `http:
  };
  const allImages = images && images.length > 0 
    ? [processImageUrl(image), ...images.map(processImageUrl)].filter(Boolean)
    : [processImageUrl(image)].filter(Boolean);
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
  const handleQuantityChange = (value) => {
    setQuantity(value)
  }
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1)
    }
  }
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  }
  const renderStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarFilled 
          key={i} 
          style={{
            color: i < Math.floor(rating) ? '#faad14' : '#d9d9d9', 
            fontSize: '12px'
          }} 
        />
      )
    }
    return stars
  }
  return (
    <Row style={{height: '100%', padding: `10px 16px`}}>
       <Col span={10} style={{borderRight: '1px solid rgb(235, 237, 240)', paddingRight: '8px', borderRadius: '8px'}}>
                   {}
          <div style={{ position: 'relative' }}>
            <Carousel
              ref={carouselRef}
              dots={false}
              arrows={true}
              beforeChange={(from, to) => setCurrentImageIndex(to)}
              customPaging={(i) => (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: i === currentImageIndex ? '#1890ff' : '#d9d9d9',
                  margin: '0 4px'
                }} />
              )}
            >
             {allImages.map((img, index) => (
               <div key={index}>
                                   <Image 
                    src={img} 
                    alt={`${name} - ${index + 1}`} 
                    preview={false}
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  />
               </div>
             ))}
           </Carousel>
                       {}
            <Button
              type="text"
              icon={<LeftOutlined />}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              onClick={() => {
                const prevIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
                setCurrentImageIndex(prevIndex);
                carouselRef.current?.goTo(prevIndex);
              }}
            />
            <Button
              type="text"
              icon={<RightOutlined />}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              onClick={() => {
                const nextIndex = currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1;
                setCurrentImageIndex(nextIndex);
                carouselRef.current?.goTo(nextIndex);
              }}
            />
         </div>
                   {}
          <Row style={{paddingTop: '10px', justifyContent: 'flex-start', gap: '8px'}}>
            {allImages.map((img, index) => (
              <div key={index} style={{ flex: '0 0 auto' }}>
                <WrapperStyleSmallImage 
                  src={img} 
                  alt={`thumbnail ${index + 1}`} 
                  preview={false} 
                  style={{
                    width: '60px', 
                    height: '60px', 
                    objectFit: 'cover',
                    border: index === currentImageIndex ? '2px solid #1890ff' : '2px solid transparent',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    carouselRef.current?.goTo(index);
                  }}
                />
              </div>
            ))}
          </Row>
       </Col>
       <Col span={14} style={{paddingLeft: '10px'}}>
       <WrapperStyledNameProduct>{name}</WrapperStyledNameProduct>
       <div style={{display: 'flex', alignItems: 'center'}}>
         {renderStars(rating)}
         <span style={{marginLeft: '4px', fontSize: '12px'}}>{rating}</span>
         <WrapperStyledTextSell>| Đã bán {formatSold(sold)}</WrapperStyledTextSell>
        </div>
        <WrapperPriceProduct>
        <WrapperTextPriceProduct>{formatPrice(price)}</WrapperTextPriceProduct>
        </WrapperPriceProduct>
        <WrapperAddressProduct>
         <span>Giao đến </span>
         <span className='address-product'>Hà Nội</span> - 
         <span className='change-address'>Đổi địa chỉ</span>
        </WrapperAddressProduct>
        <div style={{margin: '10px 0 20px 0',padding: '10px 0', borderTop: '1px solid rgb(235, 237, 240)', borderBottom: '1px solid rgb(235, 237, 240)'}}>
          <div style={{marginBottom: '10px'}}>Số lượng</div>
            <button 
              style={{border: 'none', background: 'transparent'}}
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
            <MinusOutlined style={{color: quantity <= 1 ? '#d9d9d9' : 'black'}} />
            </button>
            <WrapperInputNumber 
              value={quantity} 
              onChange={handleQuantityChange}
              min={1}
              max={stock}
            />
            <button 
              style={{border: 'none', background: 'transparent'}}
              onClick={handleIncrease}
              disabled={quantity >= stock}
            >
            <PlusOutlined style={{color: quantity >= stock ? '#d9d9d9' : 'black'}} />
            </button>
            <span style={{marginLeft: '10px', fontSize: '12px', color: '#666'}}>
              Còn {stock} sản phẩm
            </span>
        </div>
        <div style={{marginBottom: '20px'}}>
          <h4>Mô tả sản phẩm:</h4>
          <p style={{color: '#666', lineHeight: '1.6'}}>{description}</p>
        </div>
          <div style={{paddingTop: '10px', display: 'flex', gap: '10px', alignItems: 'center'}}>
            <ButtonComponent 
              size={40} 
              styleButton={{
                  height: '48px',
                  width: '220px',
                  borderRadius: '4px',
                  border: 'none',
                  background: isInCart(product?._id) ? '#52c41a' : 'rgb(255, 57, 69)',
                  fontSize: '15px',
                  fontWeight: '700'
              }}
              textButton={isInCart(product?._id) ? 'Đã có trong giỏ' : 'Thêm vào giỏ hàng'}
              StyleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
              onClick={handleAddToCart}
            />
            <ButtonComponent 
              size={40} 
              styleButton={{
                  height: '48px',
                  width: '220px',
                  borderRadius: '4px',
                  border: '1px solid rgb(0, 89, 255)',
                  background: '#fff',
                  fontSize: '15px',
                  fontWeight: '700'
              }}
              textButton='Mua trả sau góp 0%'
              StyleTextButton={{color: 'rgb(0, 89, 255)', fontSize: '15px', fontWeight: '700'}}
            />
          </div>
       </Col>
    </Row>
  )
}
export default ProductDetailComponent
