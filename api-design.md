# Thiet ke API chuan cho backend quan ly tour du lich

## 1. Nguyen tac thiet ke

- Kieu API: RESTful JSON
- Base URL: `/api/v1`
- Xac thuc: `Authorization: Bearer <token>`
- Dinh dang thoi gian: ISO 8601
- Phan trang: `page`, `limit`
- Tim kiem: `keyword`
- Sap xep: `sortBy`, `sortOrder`

## 2. Cau truc response de xuat

### Response thanh cong

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Response loi

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is invalid"
    }
  ]
}
```

## 3. Nhom API xac thuc

### `POST /auth/register`

Dang ky tai khoan khach hang.

Body:

```json
{
  "fullName": "Nguyen Van A",
  "email": "a@gmail.com",
  "phone": "0909000000",
  "password": "12345678"
}
```

### `POST /auth/login`

Dang nhap.

Body:

```json
{
  "email": "admin@gmail.com",
  "password": "12345678"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": 1,
      "fullName": "Admin",
      "email": "admin@gmail.com",
      "role": "ADMIN"
    }
  }
}
```

### `GET /auth/me`

Lay thong tin nguoi dang nhap.

### `PATCH /auth/change-password`

Doi mat khau.

### `POST /auth/forgot-password`

Gui yeu cau quen mat khau.

### `POST /auth/reset-password`

Dat lai mat khau.

## 4. Nhom API nguoi dung va phan quyen

### `GET /users`

Admin xem danh sach nguoi dung.

Query:

- `page`
- `limit`
- `keyword`
- `role`
- `status`

### `POST /users`

Admin tao tai khoan nhan vien hoac admin.

### `GET /users/:id`

Lay chi tiet nguoi dung.

### `PATCH /users/:id`

Cap nhat nguoi dung.

### `PATCH /users/:id/status`

Khoa, mo khoa tai khoan.

### `DELETE /users/:id`

Xoa mem nguoi dung neu can.

## 5. Nhom API danh muc tour

### `GET /tour-categories`

Lay danh sach danh muc.

### `POST /tour-categories`

Them danh muc.

### `GET /tour-categories/:id`

Chi tiet danh muc.

### `PATCH /tour-categories/:id`

Sua danh muc.

### `DELETE /tour-categories/:id`

Xoa danh muc.

## 6. Nhom API tour

### `GET /tours`

Danh sach tour cho admin hoac client.

Query:

- `page`
- `limit`
- `keyword`
- `categoryId`
- `destination`
- `departureLocation`
- `minPrice`
- `maxPrice`
- `status`

### `GET /tours/:id`

Chi tiet tour theo id.

### `GET /tours/slug/:slug`

Chi tiet tour theo slug de dung cho frontend.

### `POST /tours`

Them tour moi.

Body mau:

```json
{
  "categoryId": 1,
  "code": "TOUR001",
  "name": "Ha Noi - Da Nang - Hoi An",
  "slug": "ha-noi-da-nang-hoi-an",
  "departureLocation": "Ha Noi",
  "destination": "Da Nang",
  "durationDays": 4,
  "durationNights": 3,
  "transportType": "plane",
  "basePriceAdult": 4500000,
  "basePriceChild": 3200000,
  "summary": "Tour bien 4 ngay 3 dem",
  "itinerary": "Ngay 1 ...",
  "policies": "Tre em duoi 5 tuoi ..."
}
```

### `PATCH /tours/:id`

Cap nhat tour.

### `PATCH /tours/:id/status`

An, hien, dong tour.

### `DELETE /tours/:id`

Xoa mem tour.

### `POST /tours/:id/images`

Them anh cho tour.

### `DELETE /tours/:id/images/:imageId`

Xoa anh tour.

## 7. Nhom API lich khoi hanh

### `GET /tour-schedules`

Lay danh sach lich khoi hanh.

Query:

- `tourId`
- `departureDate`
- `status`
- `page`
- `limit`

### `GET /tour-schedules/:id`

Chi tiet lich khoi hanh.

### `POST /tour-schedules`

Tao lich khoi hanh moi.

Body mau:

```json
{
  "tourId": 1,
  "scheduleCode": "LKH001",
  "departureDate": "2026-05-20",
  "returnDate": "2026-05-23",
  "meetingPoint": "San bay Noi Bai",
  "adultPrice": 4700000,
  "childPrice": 3500000,
  "maxSeats": 30,
  "notes": "Tap trung truoc 2 tieng"
}
```

### `PATCH /tour-schedules/:id`

Cap nhat lich khoi hanh.

### `PATCH /tour-schedules/:id/status`

Cap nhat trang thai lich.

### `DELETE /tour-schedules/:id`

Xoa lich khoi hanh.

## 8. Nhom API booking

### `GET /bookings`

Admin, nhan vien xem danh sach booking.

Query:

- `page`
- `limit`
- `keyword`
- `scheduleId`
- `bookingStatus`
- `paymentStatus`
- `fromDate`
- `toDate`

### `GET /bookings/my-bookings`

Khach hang xem booking cua minh.

### `GET /bookings/:id`

Chi tiet booking.

### `POST /bookings`

Tao booking.

Body mau:

```json
{
  "scheduleId": 1,
  "contactName": "Nguyen Van A",
  "contactEmail": "a@gmail.com",
  "contactPhone": "0909000000",
  "totalAdults": 2,
  "totalChildren": 1,
  "note": "Can phong gan nhau",
  "travelers": [
    {
      "fullName": "Nguyen Van A",
      "dateOfBirth": "1999-01-01",
      "gender": "male",
      "travelerType": "adult",
      "identityNumber": "012345678901"
    },
    {
      "fullName": "Tran Thi B",
      "dateOfBirth": "2000-02-02",
      "gender": "female",
      "travelerType": "adult",
      "identityNumber": "012345678902"
    },
    {
      "fullName": "Nguyen Van C",
      "dateOfBirth": "2018-05-10",
      "gender": "male",
      "travelerType": "child"
    }
  ]
}
```

### `PATCH /bookings/:id/confirm`

Xac nhan booking.

### `PATCH /bookings/:id/cancel`

Huy booking.

### `PATCH /bookings/:id/complete`

Danh dau hoan thanh sau khi ket thuc tour.

## 9. Nhom API thanh toan

### `GET /payments`

Danh sach giao dich.

### `GET /payments/:id`

Chi tiet giao dich.

### `POST /payments`

Tao giao dich thanh toan cho booking.

Body mau:

```json
{
  "bookingId": 1,
  "method": "bank_transfer",
  "amount": 5000000
}
```

### `PATCH /payments/:id/confirm`

Xac nhan da thanh toan.

### `PATCH /payments/:id/refund`

Hoan tien.

### `POST /payments/webhook`

Nhan callback tu cong thanh toan neu tich hop sau.

## 10. Nhom API review

### `GET /reviews`

Lay danh sach danh gia.

Query:

- `tourId`
- `status`
- `page`
- `limit`

### `POST /reviews`

Khach hang tao danh gia.

Body:

```json
{
  "tourId": 1,
  "bookingId": 1,
  "rating": 5,
  "title": "Chuyen di rat tot",
  "content": "Huong dan vien nhiet tinh"
}
```

### `PATCH /reviews/:id`

Sua danh gia cua chinh minh.

### `PATCH /reviews/:id/status`

Admin duyet hoac tu choi danh gia.

### `DELETE /reviews/:id`

Xoa danh gia.

## 11. Nhom API tin tuc

### `GET /news`

Lay danh sach bai viet.

### `GET /news/:id`

Chi tiet bai viet.

### `GET /news/slug/:slug`

Chi tiet theo slug.

### `POST /news`

Tao bai viet.

### `PATCH /news/:id`

Sua bai viet.

### `PATCH /news/:id/status`

Dang bai hoac an bai.

### `DELETE /news/:id`

Xoa bai viet.

## 12. Nhom API dashboard thong ke

### `GET /dashboard/summary`

Thong ke tong quan cho admin.

Response de xuat:

```json
{
  "success": true,
  "data": {
    "totalTours": 50,
    "totalBookings": 320,
    "totalCustomers": 210,
    "totalRevenue": 1500000000
  }
}
```

### `GET /dashboard/revenue`

Thong ke doanh thu theo ngay, thang, nam.

Query:

- `type=day|month|year`
- `fromDate`
- `toDate`

### `GET /dashboard/bookings-by-status`

Thong ke booking theo trang thai.

## 13. Phan quyen de xuat

### Admin

- Toan quyen tat ca API

### Staff

- Quan ly tour
- Quan ly lich khoi hanh
- Quan ly booking
- Xem thanh toan
- Duyet review
- Khong duoc quan ly admin khac neu ban muon tach quyen

### Customer

- Dang ky, dang nhap
- Xem tour
- Dat tour
- Xem booking cua minh
- Tao review cua minh

## 14. Thu tu code backend de xuat

1. Auth
2. Users
3. Tour categories
4. Tours
5. Tour schedules
6. Bookings
7. Payments
8. Reviews
9. Dashboard

## 15. Goi y cau truc module backend

```text
src/
  modules/
    auth/
    users/
    tour-categories/
    tours/
    tour-schedules/
    bookings/
    payments/
    reviews/
    news/
    dashboard/
  common/
  config/
  middlewares/
  routes/
```
