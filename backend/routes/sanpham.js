const express = require('express');
const router = express.Router();
const SanPham = require('../models/Product');
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let filter = { isActive: true };
    if (category) {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const products = await SanPham.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/category/:category', async (req, res) => {
  try {
    const products = await SanPham.find({ 
      category: req.params.category, 
      isActive: true,
      status: 'active'
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const product = await SanPham.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const productData = { ...req.body };
    const product = new SanPham(productData);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const productData = { ...req.body };
    const product = await SanPham.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const existingProduct = await SanPham.findById(req.params.id);
if (!existingProduct) {
return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
}

const deletedProduct = await SanPham.findByIdAndDelete(req.params.id);
    
    if (deletedProduct) {
      res.json({ 
        message: 'Xóa sản phẩm thành công!',
        deletedProduct: {
          id: deletedProduct._id,
          name: deletedProduct.name
        }
      });
    } else {
      res.status(500).json({ message: 'Không thể xóa sản phẩm' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
  }
});
router.get('/stats/summary', async (req, res) => {
  try {
    const totalProducts = await SanPham.countDocuments({ isActive: true });
    const activeProducts = await SanPham.countDocuments({ isActive: true, status: 'active' });
    const inactiveProducts = await SanPham.countDocuments({ isActive: true, status: 'inactive' });
    const categoryStats = await SanPham.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({
      totalProducts,
      activeProducts,
      inactiveProducts,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
