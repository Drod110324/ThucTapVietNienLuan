const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Máy ảnh', 'Ống kính', 'Phụ kiện', 'Gimbal', 'Máy quay']
  },
  brand: {
    type: String,
    required: true
  },
  // Main image field (for backward compatibility)
  image: {
    type: String,
    required: true
  },
  // New main image field
  mainImage: {
    type: String,
    required: true
  },
  // Auxiliary images
  auxiliaryImages: [{
    type: String
  }],
  // Legacy images field (for backward compatibility)
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  sold: {
    type: Number,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['Hoạt động', 'Tạm ngưng', 'Hết hàng'],
    default: 'Hoạt động'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Additional fields for Vietnamese naming
  ten: String,        // Vietnamese name
  loai: String,       // Vietnamese category
  thuongHieu: String, // Vietnamese brand
  gia: Number,        // Vietnamese price
  tonKho: Number,     // Vietnamese stock
  danhGia: Number,    // Vietnamese rating
  daBan: Number,      // Vietnamese sold
  trangThai: String,  // Vietnamese status
  moTa: String,       // Vietnamese description
  anhChinh: String,   // Vietnamese main image
  anhPhu: [String]    // Vietnamese auxiliary images
}, {
  timestamps: true
})

// Pre-save middleware to sync fields
productSchema.pre('save', function(next) {
  // Sync Vietnamese fields with English fields
  if (this.name && !this.ten) this.ten = this.name;
  if (this.category && !this.loai) this.loai = this.category;
  if (this.brand && !this.thuongHieu) this.thuongHieu = this.brand;
  if (this.price && !this.gia) this.gia = this.price;
  if (this.stock && !this.tonKho) this.tonKho = this.stock;
  if (this.rating && !this.danhGia) this.danhGia = this.rating;
  if (this.sold && !this.daBan) this.daBan = this.sold;
  if (this.status && !this.trangThai) this.trangThai = this.status;
  if (this.description && !this.moTa) this.moTa = this.description;
  if (this.mainImage && !this.anhChinh) this.anhChinh = this.mainImage;
  if (this.auxiliaryImages && !this.anhPhu) this.anhPhu = this.auxiliaryImages;
  
  // Sync image field for backward compatibility
  if (this.mainImage && !this.image) this.image = this.mainImage;
  if (this.auxiliaryImages && !this.images) this.images = this.auxiliaryImages;
  
  next();
});

module.exports = mongoose.model('SanPham', productSchema, 'sanpham')
