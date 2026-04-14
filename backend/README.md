# Express TypeScript Codebase

Một khung dự án backend sử dụng Express với TypeScript, tích hợp migration.

## Mục lục

- Giới thiệu
- Công nghệ sử dụng
- Cài đặt
- Chạy dự án
- Scripts
- Cấu trúc thư mục
- License

## Giới thiệu

Dự án sử dụng stack hiện đại:
- Express + TypeScript
- ORM hỗ trợ migration (TypeORM)
- Phân lớp rõ ràng: Controller - Service
- Hỗ trợ logging, xử lý lỗi tập trung, cấu hình môi trường .env

## Công nghệ sử dụng

- Node.js
- Express.js
- TypeScript
- ORM: typeorm
- Mysql
- dotenv
- ts-node

## Cài đặt

Yêu cầu: Node.js >= 22.16.0, đã cài MySQL

1. Clone dự án:

git clone https://github.com/npnam2k3/express-ts-code-base.git
cd express-ts-code-base

2. Cài dependencies:

npm install

3. Tạo file .env:

cp .env.example .env

Cập nhật thông tin kết nối DB, PORT, JWT,... trong file .env

## Chạy dự án

1. Chạy migration để tạo bảng:

npm run migration:run

2. Chạy ở môi trường phát triển:

npm run dev

3. Tạo dữ liệu mẫu cho đồ án:

npm run seed

Tài khoản demo:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | 123456 |
| Staff | staff@example.com | 123456 |
| Customer | customer@example.com | 123456 |

4. Tạo bảng mới trong từ Entity dùng migration: (thay tên file, viết liền không dấu, không kí tự đặc biệt)
npm run migration:generate -- src/migrations/tenFile

## Scripts

| Lệnh                                 | Mô tả                                 |
|--------------------------------------|----------------------------------------|
| npm run dev                          | Chạy server với ts-node-dev           |
| npm run migration:run                | Chạy migration tạo bảng DB            |
| npm run seed                         | Tạo dữ liệu mẫu: user demo, destination, category, tour, schedule |
| npm run migration:generate -- src/migrations/tenFile   | Tạo file migration mới. Thay tên file viết liền không dấu, không kí tự đặc biệt             |

## API chính

### Auth

```bash
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/profile
```

### Public

```bash
GET /api/v1/destinations
GET /api/v1/categories
GET /api/v1/tours
GET /api/v1/tours/:slug
GET /api/v1/tour-schedules
```

### Customer

```bash
GET   /api/v1/bookings/my
POST  /api/v1/bookings
PATCH /api/v1/bookings/:id/cancel
```

### Admin/Staff

```bash
GET    /api/v1/admin/destinations
POST   /api/v1/admin/destinations
PATCH  /api/v1/admin/destinations/:id
DELETE /api/v1/admin/destinations/:id

GET    /api/v1/admin/categories
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id

GET    /api/v1/admin/tours
POST   /api/v1/admin/tours
PATCH  /api/v1/admin/tours/:id
DELETE /api/v1/admin/tours/:id

GET    /api/v1/admin/tour-schedules
POST   /api/v1/admin/tour-schedules
PATCH  /api/v1/admin/tour-schedules/:id
DELETE /api/v1/admin/tour-schedules/:id

GET    /api/v1/admin/bookings
GET    /api/v1/admin/bookings/:id
PATCH  /api/v1/admin/bookings/:id/status
PATCH  /api/v1/admin/bookings/:id/cancel

GET    /api/v1/admin/dashboard/summary
GET    /api/v1/admin/dashboard/revenue
GET    /api/v1/admin/dashboard/top-tours
```

## Cấu trúc thư mục
```bash
src/
  ├── common/                 // Định nghĩa response trả về (gồm error, success)
  ├── config/                 // Cấu hình ứng dụng, DB, load env, load entity dùng cho khởi tạo DB
  ├── constants/             // Định nghĩa hằng số dùng toàn app: error-code, message, status-code,...
  ├── database/               // Khởi tạo kết nối DB từ DB config
  ├── helpers/               // Hàm hỗ trợ
  ├── middlewares/           // Middleware custom
  ├── routes/                // Định nghĩa route
  ├── migrations/             // File migration tạo bảng trong DB
  ├── modules/              // Các module trong dự án: users, auth,...
  ├── utils/                 // Hàm tiện ích
main.ts                   // File chính: chạy app, middleware,...
```

## License

Dự án được cấp phép theo MIT License.

## Tác giả

- @npnam2k3
