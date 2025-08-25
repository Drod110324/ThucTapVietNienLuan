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
  image: {
type: String,
required: true
},
mainImage: {
type: String,
required: true
},
auxiliaryImages: [{
type: String
}],
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
  ten: String,
loai: String,
thuongHieu: String,
gia: Number,
tonKho: Number,
danhGia: Number,
daBan: Number,
trangThai: String,
moTa: String,
anhChinh: String,
anhPhu: [String]
}, {
  timestamps: true
})

productSchema.pre('save', function(next) {
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

if (this.mainImage && !this.image) this.image = this.mainImage;
if (this.auxiliaryImages && !this.images) this.images = this.auxiliaryImages;

next();
});

module.exports = mongoose.model('SanPham', productSchema, 'sanpham')
