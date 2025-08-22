import React, { useState, useEffect } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct.jsx'
import { WrapperTypeProduct, WrapperButtonMore } from './style.js'
import SliderComponent from '../../components/SliderComponent/SliderComponent.jsx'
import Slider1 from '../../assets/images/Slider1.jpg'
import Slider2 from '../../assets/images/Slider2.jpg'
import Slider4 from '../../assets/images/Slider4.png'
import Slider5 from '../../assets/images/Slider5.png'
import CardComponent from '../../components/CardComponent/CardComponent.jsx'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent.jsx'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent.jsx'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent.jsx'
import { WrapperProduct } from './style.js'
import { message } from 'antd'

const Homepage = () => {
  const arr = ['máy ảnh', 'ống kính', 'phụ kiện', 'gimbal','máy quay']
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch products from database
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/products')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Filter only active products and limit to 8 for homepage
      const activeProducts = data.filter(product => product.isActive && product.status === 'Hoạt động').slice(0, 8)
      setProducts(activeProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      message.error('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <>
      <WrapperTypeProduct>
        {arr.map((item) => {
          return( <TypeProduct name={item} key={item}  />
          )
        })}
      </WrapperTypeProduct>
      <div style={{backgroundColor: '#F2F2F2', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)'}}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <SliderComponent arrImage={[Slider1, Slider2, Slider4, Slider5]}/>
        </div>
      </div>
        <div style={{marginTop: '5px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'}}>
          <WrapperProduct style={{backgroundColor: '#F2F2F2'}}>
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} style={{ 
                width: '280px', 
                height: '320px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ 
                  width: '200px', 
                  height: '200px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px',
                  marginBottom: '16px'
                }}></div>
                <div style={{ 
                  width: '150px', 
                  height: '16px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}></div>
                <div style={{ 
                  width: '100px', 
                  height: '14px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px'
                }}></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <CardComponent key={product._id} product={product} />
            ))
          ) : (
            <div style={{ 
              width: '100%', 
              textAlign: 'center', 
              padding: '40px',
              color: '#666'
            }}>
              Chưa có sản phẩm nào
            </div>
          )}
          </WrapperProduct>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
        <WrapperButtonMore textButton='Xem Thêm' type='outline' styleButton={{
          border: '1px solid rgb(11, 116, 229)',
           color: 'rgb(11, 116, 229)',
           width: '240px',
           height: '38px',
           borderRadius: '4px',
           backgroundColor: '#fff'
          }}
          styleButtonText={{
            fontWeight: '600',
          }}
          />
        </div>
    </>
  )
}

export default Homepage
