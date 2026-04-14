# Thiet ke CSDL he thong quan ly tour du lich

## 1. Pham vi nghiep vu

He thong gom 3 nhom nguoi dung chinh:

- Admin: quan ly toan bo he thong
- Nhan vien: quan ly tour, lich khoi hanh, booking, khach hang
- Khach hang: dang ky, dang nhap, dat tour, thanh toan, xem lich su dat tour, danh gia tour

Chuc nang cot loi:

- Quan ly tai khoan va phan quyen
- Quan ly tour du lich
- Quan ly lich khoi hanh theo tung tour
- Dat tour va quan ly hanh khach
- Thanh toan
- Danh gia tour
- Bao cao doanh thu va thong ke booking

## 2. So do thuc the de xuat

### 2.1 Bang `roles`

Muc dich: danh sach vai tro he thong.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma vai tro |
| code | VARCHAR(30) | UNIQUE, NOT NULL | `ADMIN`, `STAFF`, `CUSTOMER` |
| name | VARCHAR(100) | NOT NULL | Ten hien thi |
| description | VARCHAR(255) | NULL | Mo ta |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

### 2.2 Bang `users`

Muc dich: tai khoan dang nhap he thong.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma nguoi dung |
| role_id | BIGINT | FK -> roles.id, NOT NULL | Vai tro |
| full_name | VARCHAR(150) | NOT NULL | Ho ten |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Email dang nhap |
| phone | VARCHAR(20) | UNIQUE, NULL | So dien thoai |
| password_hash | VARCHAR(255) | NOT NULL | Mat khau da ma hoa |
| avatar_url | VARCHAR(255) | NULL | Anh dai dien |
| gender | ENUM('male','female','other') | NULL | Gioi tinh |
| date_of_birth | DATE | NULL | Ngay sinh |
| address | VARCHAR(255) | NULL | Dia chi |
| status | ENUM('active','inactive','blocked') | NOT NULL DEFAULT 'active' | Trang thai tai khoan |
| last_login_at | DATETIME | NULL | Lan dang nhap cuoi |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

### 2.3 Bang `tour_categories`

Muc dich: phan loai tour.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma danh muc |
| name | VARCHAR(120) | NOT NULL | Ten danh muc |
| slug | VARCHAR(150) | UNIQUE, NOT NULL | Chuoi URL |
| description | VARCHAR(255) | NULL | Mo ta |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

### 2.4 Bang `tours`

Muc dich: thong tin tong quan cua tour.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma tour |
| category_id | BIGINT | FK -> tour_categories.id, NULL | Danh muc |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Ma tour |
| name | VARCHAR(200) | NOT NULL | Ten tour |
| slug | VARCHAR(220) | UNIQUE, NOT NULL | Chuoi URL |
| departure_location | VARCHAR(150) | NOT NULL | Noi khoi hanh |
| destination | VARCHAR(150) | NOT NULL | Diem den chinh |
| duration_days | INT | NOT NULL | So ngay |
| duration_nights | INT | NOT NULL | So dem |
| transport_type | ENUM('car','plane','train','ship','mixed') | NOT NULL | Phuong tien |
| base_price_adult | DECIMAL(12,2) | NOT NULL | Gia nguoi lon mac dinh |
| base_price_child | DECIMAL(12,2) | NOT NULL | Gia tre em mac dinh |
| summary | TEXT | NULL | Mo ta ngan |
| itinerary | LONGTEXT | NULL | Lich trinh chi tiet |
| policies | LONGTEXT | NULL | Dieu khoan, chinh sach |
| cover_image | VARCHAR(255) | NULL | Anh dai dien |
| status | ENUM('draft','published','closed') | NOT NULL DEFAULT 'draft' | Trang thai tour |
| created_by | BIGINT | FK -> users.id, NULL | Nguoi tao |
| updated_by | BIGINT | FK -> users.id, NULL | Nguoi sua |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

### 2.5 Bang `tour_images`

Muc dich: thu vien anh tour.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma anh |
| tour_id | BIGINT | FK -> tours.id, NOT NULL | Tour |
| image_url | VARCHAR(255) | NOT NULL | Duong dan anh |
| sort_order | INT | NOT NULL DEFAULT 0 | Thu tu hien thi |
| created_at | DATETIME | NOT NULL | Ngay tao |

### 2.6 Bang `tour_schedules`

Muc dich: moi dot khoi hanh cua tour.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma lich khoi hanh |
| tour_id | BIGINT | FK -> tours.id, NOT NULL | Tour cha |
| schedule_code | VARCHAR(50) | UNIQUE, NOT NULL | Ma lich |
| departure_date | DATE | NOT NULL | Ngay khoi hanh |
| return_date | DATE | NOT NULL | Ngay ket thuc |
| meeting_point | VARCHAR(255) | NULL | Diem tap trung |
| adult_price | DECIMAL(12,2) | NOT NULL | Gia nguoi lon thuc te |
| child_price | DECIMAL(12,2) | NOT NULL | Gia tre em thuc te |
| max_seats | INT | NOT NULL | Tong so cho |
| booked_seats | INT | NOT NULL DEFAULT 0 | So cho da dat |
| available_seats | INT | NOT NULL | So cho con lai |
| status | ENUM('open','full','cancelled','completed') | NOT NULL DEFAULT 'open' | Trang thai lich |
| notes | VARCHAR(255) | NULL | Ghi chu |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

Luu y:

- `available_seats = max_seats - booked_seats`
- Khi booking duoc xac nhan, he thong phai cap nhat `booked_seats` va `available_seats`

### 2.7 Bang `bookings`

Muc dich: don dat tour.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma booking |
| booking_code | VARCHAR(50) | UNIQUE, NOT NULL | Ma don |
| user_id | BIGINT | FK -> users.id, NULL | Tai khoan dat tour, co the NULL neu khach le |
| schedule_id | BIGINT | FK -> tour_schedules.id, NOT NULL | Lich khoi hanh |
| contact_name | VARCHAR(150) | NOT NULL | Nguoi lien he |
| contact_email | VARCHAR(150) | NOT NULL | Email lien he |
| contact_phone | VARCHAR(20) | NOT NULL | So dien thoai lien he |
| total_adults | INT | NOT NULL DEFAULT 1 | So nguoi lon |
| total_children | INT | NOT NULL DEFAULT 0 | So tre em |
| subtotal_amount | DECIMAL(12,2) | NOT NULL | Tam tinh |
| discount_amount | DECIMAL(12,2) | NOT NULL DEFAULT 0 | Giam gia |
| total_amount | DECIMAL(12,2) | NOT NULL | Tong tien |
| payment_status | ENUM('unpaid','partial','paid','refunded') | NOT NULL DEFAULT 'unpaid' | Trang thai thanh toan |
| booking_status | ENUM('pending','confirmed','cancelled','completed') | NOT NULL DEFAULT 'pending' | Trang thai booking |
| note | VARCHAR(500) | NULL | Ghi chu |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

### 2.8 Bang `booking_travelers`

Muc dich: danh sach hanh khach trong booking.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma hanh khach |
| booking_id | BIGINT | FK -> bookings.id, NOT NULL | Booking |
| full_name | VARCHAR(150) | NOT NULL | Ho ten |
| date_of_birth | DATE | NULL | Ngay sinh |
| gender | ENUM('male','female','other') | NULL | Gioi tinh |
| traveler_type | ENUM('adult','child') | NOT NULL | Loai hanh khach |
| identity_number | VARCHAR(50) | NULL | CCCD, passport |
| nationality | VARCHAR(100) | NULL | Quoc tich |
| created_at | DATETIME | NOT NULL | Ngay tao |

### 2.9 Bang `payments`

Muc dich: thong tin thanh toan cua booking.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma giao dich |
| booking_id | BIGINT | FK -> bookings.id, NOT NULL | Booking |
| payment_code | VARCHAR(50) | UNIQUE, NOT NULL | Ma thanh toan |
| method | ENUM('cash','bank_transfer','momo','vnpay') | NOT NULL | Hinh thuc thanh toan |
| amount | DECIMAL(12,2) | NOT NULL | So tien |
| transaction_ref | VARCHAR(100) | NULL | Ma giao dich cong thanh toan |
| status | ENUM('pending','success','failed','refunded') | NOT NULL DEFAULT 'pending' | Trang thai giao dich |
| paid_at | DATETIME | NULL | Thoi gian thanh toan |
| note | VARCHAR(255) | NULL | Ghi chu |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

### 2.10 Bang `reviews`

Muc dich: danh gia tour sau khi tham gia.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma danh gia |
| tour_id | BIGINT | FK -> tours.id, NOT NULL | Tour duoc danh gia |
| user_id | BIGINT | FK -> users.id, NOT NULL | Nguoi danh gia |
| booking_id | BIGINT | FK -> bookings.id, NULL | Booking lien quan |
| rating | TINYINT | NOT NULL | Diem 1-5 |
| title | VARCHAR(150) | NULL | Tieu de |
| content | TEXT | NULL | Noi dung |
| status | ENUM('pending','approved','rejected') | NOT NULL DEFAULT 'pending' | Kiem duyet |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

### 2.11 Bang `news`

Muc dich: bai viet, tin tuc, kinh nghiem du lich.

| Truong | Kieu du lieu | Rang buoc | Y nghia |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Ma bai viet |
| title | VARCHAR(200) | NOT NULL | Tieu de |
| slug | VARCHAR(220) | UNIQUE, NOT NULL | Chuoi URL |
| summary | TEXT | NULL | Tom tat |
| content | LONGTEXT | NOT NULL | Noi dung |
| thumbnail | VARCHAR(255) | NULL | Anh dai dien |
| author_id | BIGINT | FK -> users.id, NULL | Tac gia |
| status | ENUM('draft','published') | NOT NULL DEFAULT 'draft' | Trang thai |
| published_at | DATETIME | NULL | Ngay dang |
| created_at | DATETIME | NOT NULL | Ngay tao |
| updated_at | DATETIME | NOT NULL | Ngay cap nhat |

## 3. Quan he giua cac bang

- `roles` 1 - n `users`
- `tour_categories` 1 - n `tours`
- `tours` 1 - n `tour_images`
- `tours` 1 - n `tour_schedules`
- `users` 1 - n `bookings`
- `tour_schedules` 1 - n `bookings`
- `bookings` 1 - n `booking_travelers`
- `bookings` 1 - n `payments`
- `tours` 1 - n `reviews`
- `users` 1 - n `reviews`

## 4. Chi muc nen tao

Nen tao index cho cac cot duoi day:

- `users.email`
- `users.phone`
- `tours.code`
- `tours.slug`
- `tours.destination`
- `tour_schedules.tour_id`
- `tour_schedules.departure_date`
- `tour_schedules.status`
- `bookings.booking_code`
- `bookings.user_id`
- `bookings.schedule_id`
- `bookings.booking_status`
- `bookings.payment_status`
- `payments.booking_id`
- `payments.payment_code`
- `reviews.tour_id`

## 5. Rang buoc nghiep vu quan trong

- Khong cho booking vuot qua `available_seats`
- Chi cho phep review khi booking da `completed`
- Khi payment thanh cong va du tien, cap nhat `payment_status = paid`
- Khi booking bi huy, phai hoan lai so cho trong `tour_schedules`
- `schedule.return_date` phai lon hon `departure_date`
- `rating` chi nhan gia tri tu 1 den 5

## 6. Luong trang thai de xuat

### Booking

- `pending`: vua tao, chua duoc xac nhan
- `confirmed`: da xac nhan giu cho
- `cancelled`: da huy
- `completed`: da di tour xong

### Payment

- `pending`: cho thanh toan
- `success`: thanh toan thanh cong
- `failed`: thanh toan that bai
- `refunded`: da hoan tien

## 7. Thu tu uu tien khi code

Nen code lan luot:

1. `roles`, `users`, `auth`
2. `tour_categories`, `tours`, `tour_images`
3. `tour_schedules`
4. `bookings`, `booking_travelers`
5. `payments`
6. `reviews`
7. `news`
