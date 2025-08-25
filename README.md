# ThucTapVietNienLuan - Cửa hàng bán máy ảnh trực tuyến 

Ứng dụng web thương mại điện tử chuyên về máy ảnh và phụ kiện nhiếp ảnh, được xây dựng với React + Node.js + MongoDB.

### Người dùng
- Đăng ký/Đăng nhập tài khoản
- Xem danh sách sản phẩm
- Tìm kiếm và lọc sản phẩm
- Xem chi tiết sản phẩm
- Thêm vào giỏ hàng
- Quản lý thông tin cá nhân
- Xem lịch sử đơn hàng

### Admin
- Quản lý sản phẩm (CRUD)
- Quản lý tài khoản người dùng
- Thống kê doanh thu và đơn hàng
- Dashboard quản trị

## Công nghệ sử dụng

### Frontend
- **React 18** - Framework JavaScript
- **Ant Design** - UI Component Library
- **React Router** - Routing
- **Context API** - State Management
- **Vite** - Build Tool

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing

## Cài đặt

### 1. Clone dự án
```bash
git clone <repository-url>
cd ThucTapVietNienLuan
```

### 2. Cài đặt dependencies Frontend
```bash
npm install
```

### 3. Cài đặt dependencies Backend
```bash
cd backend
npm install
```

## Cấu hình Database

### 1. Cài đặt MongoDB

#### Option 1: MongoDB Community Server (Local)
1. Tải MongoDB Community Server từ [mongodb.com](https://www.mongodb.com/try/download/community)
2. Cài đặt với tùy chọn "Install MongoDB as a Service"
3. Khởi động MongoDB service:
```bash
Get-Service -Name "MongoDB"

Start-Service -Name "MongoDB"
```

#### Option 2: MongoDB Atlas (Cloud - Khuyến nghị)
1. Truy cập [MongoDB Atlas](https://cloud.mongodb.com/)
2. Tạo tài khoản miễn phí
3. Tạo cluster mới (chọn Free tier)
4. Tạo database user và whitelist IP
5. Lấy connection string

### 2. Cài đặt MongoDB Compass (GUI Tool)

#### Windows
1. Tải MongoDB Compass từ [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
2. Chọn phiên bản phù hợp với hệ điều hành
3. Cài đặt với tùy chọn mặc định
4. Khởi động MongoDB Compass

### 3. Kết nối MongoDB Compass

#### Kết nối Local MongoDB
```
mongodb://localhost:27017
```

#### Kết nối MongoDB Atlas
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Ví dụ:**
```
mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/Camera?retryWrites=true&w=majority
```

### 4. Sử dụng MongoDB Compass

#### Khám phá Database
1. **Browse Collections:** Xem cấu trúc collections
2. **Query Documents:** Tìm kiếm và lọc dữ liệu
3. **Aggregation Pipeline:** Chạy aggregation queries
4. **Schema Analysis:** Phân tích cấu trúc dữ liệu

#### Quản lý dữ liệu
1. **Insert Document:** Thêm document mới
2. **Update Document:** Sửa đổi document
3. **Delete Document:** Xóa document
4. **Export/Import:** Xuất/nhập dữ liệu

#### Monitoring
1. **Performance:** Theo dõi hiệu suất queries
2. **Indexes:** Quản lý indexes
3. **Users:** Quản lý database users
4. **Logs:** Xem database logs

### 2. Cấu hình Backend
File `backend/config.env`:

#### Cho Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/Camera
PORT=5000
```

#### Cho MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Camera?retryWrites=true&w=majority
PORT=5000
```

**Lưu ý:** Thay `<username>`, `<password>`, `<cluster>` bằng thông tin thực tế từ MongoDB Atlas.

## Chạy ứng dụng

### 1. Khởi động Backend
```bash
cd backend

node setup-database.js

node server.js
```

**Kết quả mong đợi:**
```
Connected to MongoDB successfully!
Server is running on port 5000
```

### 2. Khởi động Frontend
```bash
cd ..

npm run dev
```

**Kết quả mong đợi:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Truy cập ứng dụng
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Cấu trúc dự án

```
ThucTapVietNienLuan/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   └── assets/         # Images, icons
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── config.env          # Environment variables
│   ├── server.js           # Main server file
│   ├── setup-database.js   # Database initialization
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/taikhoan/login` - Đăng nhập
- `POST /api/taikhoan` - Đăng ký tài khoản mới

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/admin/products` - Thêm sản phẩm mới (Admin)
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/admin/products/:id` - Xóa sản phẩm (Admin)

### Accounts
- `GET /api/taikhoan` - Lấy danh sách tài khoản (Admin)
- `PUT /api/taikhoan/:id` - Cập nhật tài khoản
- `DELETE /api/taikhoan/:id` - Xóa tài khoản (Admin)

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan
- `GET /api/dashboard/revenue` - Thống kê doanh thu
- `GET /api/dashboard/top-products` - Sản phẩm bán chạy

## Tài khoản mặc định

Sau khi chạy `setup-database.js`, hệ thống sẽ có:

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@example.com`
- **Vai trò:** `admin`

### Sample Products
- Canon EOS R5 - 85,000,000 VND
- Sony A7 IV - 45,000,000 VND  
- Nikon Z6 III - 55,000,000 VND

## Xử lý sự cố

### 1. Backend không khởi động được

#### Lỗi: "Cannot find module"
```bash
cd backend
npm install
```

#### Lỗi: "EADDRINUSE: address already in use :::5000"
```bash
netstat -ano | findstr :5000

taskkill /PID <PID> /F
```

#### Lỗi: "MongoDB connection error"
```bash
Get-Service -Name "MongoDB"

Start-Service -Name "MongoDB"
```

#### Lỗi: "MongoDB Atlas connection failed"
1. **Kiểm tra Network Access:**
   - Vào MongoDB Atlas → Network Access
   - Thêm IP address hiện tại vào whitelist
   - Hoặc thêm `0.0.0.0/0` để cho phép tất cả IP (chỉ dùng cho development)

2. **Kiểm tra Database User:**
   - Vào MongoDB Atlas → Database Access
   - Đảm bảo user có quyền readWrite trên database

3. **Kiểm tra Connection String:**
   - Copy connection string từ MongoDB Atlas
   - Thay `<password>` bằng password thực tế
   - Đảm bảo database name đúng (ví dụ: `Camera`)

4. **Test Connection:**
   - Sử dụng MongoDB Compass để test connection trước
   - Nếu Compass kết nối được, vấn đề có thể ở backend code

### 2. Frontend không kết nối được Backend

#### Kiểm tra URL API
Đảm bảo tất cả API calls đều có prefix `/api`:
```javascript
fetch('http://localhost:5000/taikhoan/login')

fetch('http://localhost:5000/api/taikhoan/login')
```

#### Kiểm tra CORS
Backend đã có CORS middleware, nhưng nếu vẫn lỗi:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 3. Database trống

#### Chạy lại setup database
```bash
cd backend
node setup-database.js
```

#### Kiểm tra kết nối MongoDB
```bash
mongosh --eval "use Camera; db.sanpham.find().count()"
```

### 4. Lỗi đăng nhập

#### Kiểm tra tài khoản tồn tại
```bash
curl -X POST http://localhost:5000/api/taikhoan/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Kiểm tra password hash
Model `TaiKhoan` sử dụng `bcryptjs` để hash password. Đảm bảo field name là `password` (không phải `matKhau`).

## Sử dụng ứng dụng

### 1. Đăng nhập Admin
1. Truy cập http://localhost:5173
2. Click "Đăng nhập/Đăng Ký"
3. Sử dụng tài khoản: `admin` / `admin123`
4. Sau khi đăng nhập, menu Admin sẽ xuất hiện

### 2. Quản lý sản phẩm
1. Đăng nhập với tài khoản Admin
2. Vào menu "Quản lý sản phẩm"
3. Thêm/Sửa/Xóa sản phẩm

### 3. Quản lý tài khoản
1. Đăng nhập với tài khoản Admin  
2. Vào menu "Quản lý tài khoản"
3. Quản lý vai trò và trạng thái người dùng

## Development

### Hot Reload
- **Frontend:** Tự động reload khi thay đổi code
- **Backend:** Cần restart server khi thay đổi

### Environment Variables
Tạo file `.env` trong thư mục gốc:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Database Schema
Xem file `backend/models/` để hiểu cấu trúc database.



**Lưu ý:** Đây là dự án thực tập, chỉ sử dụng cho mục đích học tập và phát triển.
