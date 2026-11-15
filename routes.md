# AwanMart Routes Documentation

Dokumentasi routing aplikasi e-commerce AwanMart menggunakan Laravel.

## 1. Public Routes

Route yang dapat diakses tanpa autentikasi.

- `GET /` — Menampilkan homepage.
- `GET /products` — Menampilkan seluruh katalog produk.
- `GET /products/{slug}` — Menampilkan detail produk.
- `GET /categories` — Menampilkan seluruh kategori.
- `GET /categories/{slug}` — Menampilkan produk berdasarkan kategori.
- `GET /search` — Melakukan pencarian produk.
- `GET /about` — Menampilkan informasi AwanMart.
- `GET /help` — Menampilkan halaman bantuan.

## 2. Authentication Routes

Prefix: `/auth`

- `GET /auth/login` — Menampilkan halaman login.
- `POST /auth/login` — Memproses autentikasi pengguna.
- `GET /auth/register` — Menampilkan halaman registrasi.
- `POST /auth/register` — Memproses registrasi pengguna.
- `POST /auth/logout` — Mengakhiri sesi pengguna.
- `GET /auth/forgot-password` — Menampilkan halaman lupa password.
- `POST /auth/forgot-password` — Mengirimkan link reset password.
- `GET /auth/reset-password/{token}` — Menampilkan halaman reset password.
- `POST /auth/reset-password` — Memproses perubahan password.

## 3. Customer Routes

Middleware: `auth`, `role:pelanggan`

### Shopping Cart

- `GET /cart` — Menampilkan keranjang belanja.
- `POST /cart` — Menambahkan produk ke keranjang.
- `PATCH /cart/{id}` — Memperbarui kuantitas produk.
- `DELETE /cart/{id}` — Menghapus produk dari keranjang.

### Checkout

- `GET /checkout` — Menampilkan halaman checkout.
- `POST /checkout` — Memproses checkout dan membuat pesanan.

### Orders

- `GET /orders` — Menampilkan riwayat pesanan.
- `GET /orders/{id}` — Menampilkan detail pesanan.
- `POST /orders/{id}/cancel` — Mengajukan pembatalan pesanan.

### Profile

- `GET /profile` — Menampilkan profil pelanggan.
- `PATCH /profile` — Memperbarui informasi profil.
- `PATCH /profile/password` — Memperbarui password.

### Addresses

- `GET /addresses` — Menampilkan daftar alamat.
- `POST /addresses` — Menambahkan alamat baru.
- `PATCH /addresses/{id}` — Memperbarui alamat.
- `DELETE /addresses/{id}` — Menghapus alamat.

## 4. Admin Routes

Middleware: `auth`, `role:admin`

Prefix: `/admin`

### Dashboard

- `GET /admin` — Menampilkan dashboard admin (`admin.dashboard`).
- `GET /admin/orders` — Menampilkan dan memfilter pesanan (`admin.orders.index`).
- `GET /admin/orders/{order}` — Menampilkan detail pesanan (`admin.orders.show`).
- `PATCH /admin/orders/{order}/status` — Memperbarui status pesanan yang diizinkan (`admin.orders.update-status`).

### Products Management

- `GET /admin/products` — Menampilkan daftar produk.
- `GET /admin/products/create` — Menampilkan form penambahan produk.
- `POST /admin/products` — Menambahkan produk baru.
- `GET /admin/products/{id}/edit` — Menampilkan form pengeditan produk.
- `PATCH /admin/products/{id}` — Memperbarui informasi produk.
- `DELETE /admin/products/{id}` — Menghapus produk.

### Categories Management

- `GET /admin/categories` — Menampilkan daftar kategori.
- `POST /admin/categories` — Menambahkan kategori baru.
- `PATCH /admin/categories/{id}` — Memperbarui kategori.
- `DELETE /admin/categories/{id}` — Menghapus kategori.

### Orders Management

- `GET /admin/orders` — Menampilkan seluruh pesanan.
- `GET /admin/orders/{id}` — Menampilkan detail pesanan.
- `PATCH /admin/orders/{id}/status` — Memperbarui status pesanan.

### Customers Management

- `GET /admin/customers` — Menampilkan daftar pelanggan.
- `GET /admin/customers/{id}` — Menampilkan detail pelanggan.

### Suppliers Management

- `GET /admin/suppliers` — Menampilkan daftar supplier.
- `POST /admin/suppliers` — Menambahkan supplier.
- `GET /admin/suppliers/{id}` — Menampilkan detail supplier.
- `PATCH /admin/suppliers/{id}` — Memperbarui informasi supplier.
- `DELETE /admin/suppliers/{id}` — Menghapus supplier.

### Procurement Management

- `GET /admin/procurements` — Menampilkan daftar pengadaan.
- `GET /admin/procurements/create` — Menampilkan form pengadaan.
- `GET /admin/procurements/options` — Mencari supplier atau produk untuk form pengadaan.
- `POST /admin/procurements` — Membuat permintaan pengadaan.
- `GET /admin/procurements/{id}` — Menampilkan detail pengadaan.
- `PATCH /admin/procurements/{id}/status` — Menyetujui pengadaan atau menandai barang diterima.

Status pengadaan adalah `pending`, `approved` (diterima supplier), `rejected`, `shipped`, dan `completed`. Supplier hanya dapat mengakses permintaan milik akun suppliernya, menerima/menolak permintaan yang masih `pending`, dan mengonfirmasi pengiriman setelah menerima. Admin hanya menambah stok ketika menandai barang diterima (`completed`) setelah supplier mengonfirmasi status `shipped`. Nomor pengadaan ditampilkan dari ID record karena skema belum memiliki kolom nomor tersendiri. Kurir, nomor resi, dan riwayat status belum didukung.

## 5. Supplier Portal

Middleware: `auth`, `role:supplier`

- `GET /supplier/procurements` — Melihat permintaan pengadaan milik supplier aktif, termasuk filter dan pagination.
- `GET /supplier/procurements/{procurement}` — Melihat detail permintaan milik supplier aktif.
- `PATCH /supplier/procurements/{procurement}/accept` — Menerima permintaan yang masih `pending`.
- `PATCH /supplier/procurements/{procurement}/reject` — Menolak permintaan `pending` dengan alasan.
- `PATCH /supplier/procurements/{procurement}/ship` — Mengonfirmasi pengiriman untuk permintaan `approved`.

## 5. Supplier Portal

Middleware: `auth`, `role:supplier`

Prefix: `/supplier`

- `GET /supplier/procurements` — Melihat permintaan pengadaan milik supplier aktif, termasuk filter dan pagination.
- `GET /supplier/procurements/{procurement}` — Melihat detail permintaan milik supplier aktif.
- `PATCH /supplier/procurements/{procurement}/accept` — Menerima permintaan yang masih `pending`.
- `PATCH /supplier/procurements/{procurement}/reject` — Menolak permintaan `pending` dengan alasan.
- `PATCH /supplier/procurements/{procurement}/ship` — Mengonfirmasi pengiriman untuk permintaan `approved`.

Supplier hanya dapat membaca atau mengubah pengadaan yang terhubung ke profil supplier miliknya. Stok tidak berubah saat permintaan diterima atau dikirim; hanya penerimaan yang dikonfirmasi admin setelah status `shipped` yang memperbarui stok. Kurir, nomor resi, dan notifikasi admin belum didukung infrastruktur.

## 6. Middleware & Authorization

Middleware digunakan untuk membatasi akses berdasarkan status autentikasi dan role pengguna.

- `guest` — Membatasi akses halaman autentikasi bagi pengguna yang sudah login.
- `auth` — Memastikan pengguna sudah login.
- `role:admin` — Membatasi akses khusus admin.
- `role:pelanggan` — Membatasi akses khusus pelanggan.
- `role:supplier` — Membatasi akses khusus supplier.

Gunakan Laravel Policies atau Gates untuk memastikan pengguna hanya dapat mengakses dan mengubah resource yang menjadi haknya.

## 7. Security Considerations

- Validasi seluruh input pengguna menggunakan Laravel Validation.
- Terapkan Rate Limiting untuk membatasi percobaan login dan request berlebihan.
- Jangan mempercayai harga produk dari frontend. Ambil harga terbaru dari database saat checkout.
- Pastikan pelanggan hanya dapat mengakses data miliknya sendiri.
- Pastikan supplier hanya dapat mengakses permintaan pengadaan yang ditujukan kepadanya.
- Validasi setiap perubahan status pesanan dan pengadaan di backend.
- Gunakan CSRF protection untuk request berbasis session.
- Gunakan database transaction untuk menjaga konsistensi proses checkout.

## 8. Development Priority

Urutan implementasi fitur yang disarankan:

1. Authentication dan Role Middleware.
2. Public Homepage, Products, dan Categories.
3. Customer Cart dan Checkout.
4. Customer Orders dan Profile.
5. Admin Products dan Categories.
6. Admin Orders.
7. Admin Suppliers dan Procurements.
8. Supplier Dashboard dan Procurement Requests.
9. Security Testing dan validasi seluruh alur.

---

**Framework:** Laravel  
**Architecture:** Role-Based Access Control (RBAC)  
**Roles:** Admin, Customer, Supplier
