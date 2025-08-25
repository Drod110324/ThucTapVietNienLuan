import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({ name, onClick }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate('/products', { 
        state: { 
          selectedCategory: name,
          selectedFilters: { categories: [name] }
        } 
      })
    }
  }

  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '120px',
        height: '40px',
        padding: '8px 16px',
        border: 'none',
        borderRadius: 6,
        background: '#fff',
        color: '#1890ff',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        transition: 'all 0.2s ease',
      }}
      onClick={handleClick}
      title={`Xem tất cả ${name}`}
      onMouseEnter={(e) => {
        e.target.style.background = '#f0f8ff'
        e.target.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = '#fff'
        e.target.style.transform = 'translateY(0)'
      }}
    >
      {name}
    </button>
  )
}
export default TypeProduct
