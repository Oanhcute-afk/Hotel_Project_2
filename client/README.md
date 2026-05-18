# Hotel Project 2

## 1. Giới thiệu dự án

**Hotel Project 2** là website đặt phòng khách sạn được xây dựng theo mô hình **frontend ReactJS** và **backend Node.js/Express**. Ứng dụng hỗ trợ người dùng tìm kiếm khách sạn, xem chi tiết phòng/khách sạn, đăng nhập tài khoản, đặt phòng, thanh toán/checkout và quản lý thông tin cá nhân.

Ngoài chức năng dành cho người dùng, dự án còn có khu vực quản lý cho admin/manager để quản lý khách sạn, người dùng, voucher và hóa đơn đặt phòng.

---

## 2. Công nghệ sử dụng

### Frontend

- ReactJS
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Firebase
- Framer Motion
- Lucide React
- Recharts
- jsPDF, html2canvas

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token, JWT
- bcryptjs
- Multer
- Nodemailer
- dotenv
- CORS
- Google Generative AI

---

## 3. Chức năng chính

### Người dùng

- Đăng ký, đăng nhập tài khoản
- Xem danh sách khách sạn
- Tìm kiếm và lọc khách sạn
- Xem chi tiết khách sạn
- Xem đánh giá và bình luận
- Đặt phòng khách sạn
- Thanh toán/checkout đơn đặt phòng
- Xem và cập nhật thông tin cá nhân
- Xem ưu đãi, voucher và thông tin hỗ trợ

### Quản lý/Admin

- Xem dashboard quản lý
- Quản lý khách sạn
- Quản lý người dùng
- Quản lý voucher
- Quản lý hóa đơn/đơn đặt phòng
- Upload hình ảnh khách sạn
- Theo dõi đánh giá, bình luận của khách hàng

---

## 4. Cấu trúc thư mục

```txt
Hotel_Project_2/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Comment.js
│   │   ├── Destination.js
│   │   ├── Hotel.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── Voucher.js
│   ├── routes/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── comments.js
│   │   ├── manager.js
│   │   ├── reviews.js
│   │   └── users.js
│   ├── uploads/
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   └── components/
│   │   │       ├── pages/
│   │   │       ├── ui/
│   │   │       ├── App.jsx
│   │   │       └── routes.jsx
│   │   ├── components/
│   │   │   └── AuthModal.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   ├── firebase.js
│   │   │   └── utils.js
│   │   ├── styles/
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 5. Hướng dẫn cài đặt và chạy dự án

> Lưu ý: Dự án được chia thành 2 phần riêng biệt là `backend` và `client`. Không chạy lệnh `npm install` hoặc `npm run dev` ở thư mục gốc nếu thư mục gốc không có `package.json`.

### Bước 1: Clone hoặc tải dự án

```bash
git clone <link-repository>
cd Hotel_Project_2
```

Hoặc nếu đã có file project, giải nén và mở thư mục `Hotel_Project_2` bằng VS Code.

---

### Bước 2: Cài đặt backend

Di chuyển vào thư mục backend:

```bash
cd backend
```

Cài đặt thư viện:

```bash
npm install
```

Tạo file `.env` trong thư mục `backend` nếu chưa có:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hotel_project_2
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
GEMINI_API_KEY=your_google_generative_ai_key
```

Chạy backend:

```bash
npm run dev
```

Nếu project chưa cấu hình script `dev`, có thể chạy trực tiếp:

```bash
node server.js
```

Hoặc:

```bash
npx nodemon server.js
```

Backend thường chạy tại:

```txt
http://localhost:5000
```

---

### Bước 3: Cài đặt frontend

Mở terminal mới, quay lại thư mục gốc rồi vào thư mục client:

```bash
cd client
```

Cài đặt thư viện:

```bash
npm install
```

Tạo file `.env` trong thư mục `client` nếu cần cấu hình API hoặc Firebase:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Chạy frontend:

```bash
npm run dev
```

Frontend thường chạy tại:

```txt
http://localhost:5173
```

---

## 6. Các route/trang chính ở frontend

Một số trang chính trong dự án:

- `Home.jsx`: Trang chủ
- `Discover.jsx`: Trang khám phá khách sạn/địa điểm
- `Search.jsx`: Trang tìm kiếm khách sạn
- `HotelDetail.jsx`: Trang chi tiết khách sạn
- `Checkout.jsx`: Trang đặt phòng/thanh toán
- `Profile.jsx`: Trang thông tin cá nhân
- `Offers.jsx`: Trang ưu đãi
- `Support.jsx`: Trang hỗ trợ
- `ManagerDashboard.jsx`: Trang dashboard quản lý
- `ManageHotels.jsx`: Quản lý khách sạn
- `ManageUsers.jsx`: Quản lý người dùng
- `ManageVouchers.jsx`: Quản lý voucher
- `ManageInvoices.jsx`: Quản lý hóa đơn
- `NotFound.jsx`: Trang lỗi 404

---

## 7. Các nhóm API ở backend

Dự án có các nhóm route chính:

```txt
backend/routes/api.js
backend/routes/auth.js
backend/routes/users.js
backend/routes/comments.js
backend/routes/reviews.js
backend/routes/manager.js
```

Các model chính:

```txt
Booking.js
Comment.js
Destination.js
Hotel.js
Review.js
User.js
Voucher.js
```

---

## 8. Lưu ý khi nộp bài hoặc đưa lên GitHub

Không nên upload các thư mục/file sau lên GitHub:

```txt
node_modules/
.env
backend/uploads/ nếu chứa ảnh test hoặc dữ liệu cá nhân
error.log
```

Nên có file `.gitignore` với nội dung cơ bản:

```gitignore
node_modules/
.env
*.log
backend/uploads/
dist/
```

Nếu muốn người khác chạy được project, chỉ cần giữ lại:

```txt
package.json
package-lock.json
src/
public/
backend/
client/
```

Người khác sẽ tự cài thư viện bằng:

```bash
npm install
```

---

## 9. Tác giả

- Nhóm: Trần Ngọc Oanh - 23730431, Nguyễn Bảo Định -  23731621, Dương Thiên Ân-23730281 
- Dự án: Hotel Project 2
- Mục đích: Bài tập xây dựng website đặt phòng khách sạn bằng ReactJS và Node.js
