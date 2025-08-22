const express = require('express');
const router = express.Router();
const TaiKhoan = require('../models/TaiKhoan');
router.get('/', async (req, res) => {
  try {
    const query = req.query.showAll === 'true' ? {} : { trangThai: true };
    const accounts = await TaiKhoan.find(query).select('-password');
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const taiKhoan = await TaiKhoan.findById(req.params.id).select('-password');
    if (!taiKhoan) {
      return res.status(404).json({ message: 'Tài khoản không tìm thấy' });
    }
    res.json(taiKhoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const existingEmail = await TaiKhoan.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
    }
    const existingUsername = await TaiKhoan.findOne({ username: req.body.username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username đã tồn tại trong hệ thống' });
    }
         const taiKhoan = new TaiKhoan({
       username: req.body.username,
       password: req.body.password, 
       email: req.body.email,
       hoTen: req.body.hoTen || req.body.username, 
       soDienThoai: req.body.soDienThoai || '',
       diaChi: req.body.diaChi || '',
       vaiTro: req.body.vaiTro || 'user',
     });
    const newTaiKhoan = await taiKhoan.save();
    const { password, ...taiKhoanWithoutPassword } = newTaiKhoan.toObject();
    res.status(201).json(taiKhoanWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const taiKhoan = await TaiKhoan.findById(req.params.id);
    if (!taiKhoan) {
      return res.status(404).json({ message: 'Tài khoản không tìm thấy' });
    }
    const allowedUpdates = [
      'hoTen',
      'email',
      'soDienThoai',
      'diaChi',
      'vaiTro',
      'trangThai',
    ];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        taiKhoan[field] = req.body[field];
      }
    });
    if (req.body.password) {
      taiKhoan.password = req.body.password; 
    }
    const updatedTaiKhoan = await taiKhoan.save();
    const { password, ...taiKhoanWithoutPassword } = updatedTaiKhoan.toObject();
    res.json(taiKhoanWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const taiKhoan = await TaiKhoan.findById(req.params.id);
    if (!taiKhoan) {
      return res.status(404).json({ message: 'Tài khoản không tìm thấy' });
    }
    taiKhoan.trangThai = false;
    await taiKhoan.save();
    res.json({ message: 'Xóa tài khoản thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    let taiKhoan;
    if (username) {
      taiKhoan = await TaiKhoan.findOne({
        username: username,
        trangThai: true,
      });
    } else if (email) {
      taiKhoan = await TaiKhoan.findOne({
        email: email,
        trangThai: true,
      });
    }
    if (!taiKhoan) {
      return res
        .status(401)
        .json({ message: 'Tài khoản không tồn tại hoặc đã bị khóa' });
    }
    const isPasswordValid = await taiKhoan.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }
    const { password: _, ...taiKhoanWithoutPassword } = taiKhoan.toObject();
    res.json({
      message: 'Đăng nhập thành công',
      user: taiKhoanWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
