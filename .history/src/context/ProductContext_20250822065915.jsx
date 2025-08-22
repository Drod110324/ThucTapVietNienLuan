import React, { useState, useEffect } from 'react';
import { ProductContext } from './ProductContextInstance';
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://localhost:5000';
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      localStorage.setItem('productsLastUpdate', Date.now().toString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const productsChanged = localStorage.getItem('productsChanged');
    if (productsChanged === 'true') {
      fetchProducts();
      localStorage.removeItem('productsChanged');
    } else {
      fetchProducts();
    }
  }, []);
  useEffect(() => {
    const checkForUpdates = () => {
      const lastUpdate = localStorage.getItem('productsLastUpdate');
      const productsChanged = localStorage.getItem('productsChanged');
      const now = Date.now();
      const timeSinceUpdate = now - (lastUpdate ? parseInt(lastUpdate) : 0);
      if (productsChanged === 'true' || timeSinceUpdate > 30000) {
        fetchProducts();
        localStorage.removeItem('productsChanged');
      }
    };
    const interval = setInterval(checkForUpdates, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleFocus = () => {
      fetchProducts();
    };
    const handlePopState = () => {
      setTimeout(() => fetchProducts(), 100); 
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      const addedProduct = await response.json();
      setProducts(prev => [...prev, addedProduct]);
      return addedProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };
  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const updated = await response.json();
      setProducts(prev => prev.map(product => 
        product._id === id ? updated : product
      ));
      return updated;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(prev => prev.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };
  const getProductsByCategory = (category) => {
    return products.filter(product => 
      product.category === category && product.status === 'active' && product.isActive
    );
  };
  const getProductById = (id) => {
    return products.find(product => product._id === id || product.id === id);
  };
  const getAllActiveProducts = () => {
    return products.filter(product => product.status === 'active' && product.isActive);
  };
  const refreshProducts = () => {
    fetchProducts();
  };
  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductById,
    getAllActiveProducts,
    refreshProducts
  };
  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
