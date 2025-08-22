const express = require('express')
const router = express.Router()
const SanPham = require('../models/Product')
router.get('/', async (req, res) => {
  try {
    const products = await SanPham.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body)
    const newProduct = await product.save()
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    res.json({ message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
module.exports = router
