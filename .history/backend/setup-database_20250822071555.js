const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Camera')
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    setupDatabase();
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

// Import models
const SanPham = require('./models/Product');
const TaiKhoan = require('./models/TaiKhoan');

async function setupDatabase() {
  try {
    // Xóa dữ liệu cũ
    await SanPham.deleteMany({});
    await TaiKhoan.deleteMany({});
    
    console.log('Cleared existing data');

    // Tạo dữ liệu sản phẩm mẫu
    const sanPhamData = [
      {
        name: 'Canon EOS R5',
        description: 'Máy ảnh mirrorless full-frame với độ phân giải 45MP',
        price: 85000000,
        category: 'máy ảnh',
        brand: 'Canon',
        image: 'https://via.placeholder.com/400x300?text=Canon+EOS+R5',
        images: [
          'https://via.placeholder.com/400x300?text=Canon+EOS+R5+1',
          'https://via.placeholder.com/400x300?text=Canon+EOS+R5+2'
        ],
        stock: 10,
        rating: 4.8,
        sold: 25,
        status: 'active',
        isActive: true
      },
      {
        name: 'Sony A7 IV',
        description: 'Máy ảnh mirrorless full-frame với độ phân giải 33MP',
        price: 45000000,
        category: 'máy ảnh',
        brand: 'Sony',
        image: 'https://via.placeholder.com/400x300?text=Sony+A7+IV',
        images: [
          'https://via.placeholder.com/400x300?text=Sony+A7+IV+1',
          'https://via.placeholder.com/400x300?text=Sony+A7+IV+2'
        ],
        stock: 15,
        rating: 4.7,
        sold: 30,
        status: 'active',
        isActive: true
      },
      {
        name: 'Nikon Z6 III',
        description: 'Máy ảnh mirrorless full-frame với độ phân giải 24.5MP',
        price: 55000000,
        category: 'máy ảnh',
        brand: 'Nikon',
        image: 'https://via.placeholder.com/400x300?text=Nikon+Z6+III',
        images: [
          'https://via.placeholder.com/400x300?text=Nikon+Z6+III+1',
          'https://via.placeholder.com/400x300?text=Nikon+Z6+III+2'
        ],
        stock: 8,
        rating: 4.6,
        sold: 18,
        status: 'active',
        isActive: true
      }
    ];

    // Thêm sản phẩm vào database
    await SanPham.insertMany(sanPhamData);
    console.log('Added sample products');

    // Tạo tài khoản admin mẫu
    const adminAccount = {
      username: 'admin',
      email: 'admin@example.com',
      hoTen: 'Administrator',
      matKhau: 'admin123',
      vaiTro: 'admin',
      trangThai: true
    };

    await TaiKhoan.create(adminAccount);
    console.log('Added admin account');

    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}
