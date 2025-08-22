const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './config.env' });

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Camera')
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    restoreData();
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

// Import models
const SanPham = require('./models/Product');
const TaiKhoan = require('./models/TaiKhoan');

async function restoreData() {
  try {
    console.log('Starting data restoration...');
    
    // Đọc file backup
    const backupPath = path.join(__dirname, 'Camera.sanpham.json');
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    console.log(`Found ${backupData.length} products in backup file`);
    
    // Xóa dữ liệu cũ trong collection sanpham
    await SanPham.deleteMany({});
    console.log('Cleared existing products');
    
    // Khôi phục dữ liệu sản phẩm
    const restoredProducts = [];
    for (const product of backupData) {
      // Chuyển đổi ObjectId và Date
      const cleanProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image: product.image,
        images: product.images,
        stock: product.stock,
        rating: product.rating,
        sold: product.sold,
        status: product.status,
        isActive: product.isActive
      };
      
      const newProduct = new SanPham(cleanProduct);
      await newProduct.save();
      restoredProducts.push(newProduct);
      console.log(`Restored: ${product.name}`);
    }
    
    console.log(`Successfully restored ${restoredProducts.length} products`);
    
    // Tạo tài khoản admin nếu chưa có
    const existingAdmin = await TaiKhoan.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const adminAccount = {
        username: 'admin',
        email: 'admin@example.com',
        hoTen: 'Administrator',
        password: 'admin123',
        vaiTro: 'admin',
        trangThai: true
      };
      
      await TaiKhoan.create(adminAccount);
      console.log('Created admin account: admin/admin123');
    } else {
      console.log('Admin account already exists');
    }
    
    // Hiển thị thống kê
    const totalProducts = await SanPham.countDocuments();
    const totalAccounts = await TaiKhoan.countDocuments();
    
    console.log('\n=== RESTORATION COMPLETE ===');
    console.log(`Total products: ${totalProducts}`);
    console.log(`Total accounts: ${totalAccounts}`);
    console.log('=============================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error restoring data:', error);
    process.exit(1);
  }
}
