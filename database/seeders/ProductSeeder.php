<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $categories = [
            [
                'name' => 'Laptop',
                'icon' => 'Laptop',
                'description' => 'Laptop untuk produktivitas, bisnis, pendidikan, dan gaming.',
            ],
            [
                'name' => 'Smartphone',
                'icon' => 'Smartphone',
                'description' => 'Smartphone dengan teknologi dan fitur terkini.',
            ],
            [
                'name' => 'Tablet',
                'icon' => 'Tablet',
                'description' => 'Tablet untuk hiburan, kreativitas, dan produktivitas.',
            ],
            [
                'name' => 'Komputer',
                'icon' => 'Monitor',
                'description' => 'Komputer desktop dan mini PC untuk kebutuhan personal maupun profesional.',
            ],
            [
                'name' => 'Monitor',
                'icon' => 'Monitor',
                'description' => 'Monitor untuk gaming, pekerjaan profesional, dan multimedia.',
            ],
            [
                'name' => 'Aksesoris',
                'icon' => 'Keyboard',
                'description' => 'Aksesoris komputer seperti keyboard, mouse, dan perangkat pendukung.',
            ],
            [
                'name' => 'Audio',
                'icon' => 'Headphones',
                'description' => 'Perangkat audio seperti headphone, earphone, dan speaker.',
            ],
            [
                'name' => 'Storage',
                'icon' => 'HardDrive',
                'description' => 'Perangkat penyimpanan data seperti SSD dan media penyimpanan eksternal.',
            ],
        ];

        $categoryIds = [];

        foreach ($categories as $item) {
            $category = Category::query()->firstOrCreate(
                ['name' => $item['name']],
                ['description' => $item['description'], 'icon' => $item['icon']]
            );

            $categoryIds[$item['name']] = $category->id;
        }

        /*
        |--------------------------------------------------------------------------
        | Products
        |--------------------------------------------------------------------------
        */

        $products = [
            // LAPTOP
            [
                'category' => 'Laptop',
                'name' => 'MacBook Air M2',
                'description' => 'Laptop tipis dan ringan dari Apple dengan chip M2, layar Liquid Retina, dan daya tahan baterai yang luar biasa.',
                'price' => 15000000,
                'stock' => 15,
                'image' => 'photo-1517336714731-489689fd1ca8',
            ],
            [
                'category' => 'Laptop',
                'name' => 'MacBook Pro M3 Pro',
                'description' => 'Laptop profesional Apple dengan chip M3 Pro, layar Liquid Retina XDR, dan performa tinggi untuk pekerjaan kreatif.',
                'price' => 32000000,
                'stock' => 8,
                'image' => 'photo-1496181133206-80ce9b88a853',
            ],
            [
                'category' => 'Laptop',
                'name' => 'ASUS Vivobook 14',
                'description' => 'Laptop serbaguna dengan desain ringkas, layar Full HD, dan performa untuk produktivitas sehari-hari.',
                'price' => 8500000,
                'stock' => 20,
                'image' => 'photo-1588872657578-7efd1f1555ed',
            ],
            [
                'category' => 'Laptop',
                'name' => 'ASUS ROG Zephyrus G14',
                'description' => 'Laptop gaming premium dengan performa grafis tinggi, desain ringkas, dan layar berkualitas.',
                'price' => 26000000,
                'stock' => 6,
                'image' => 'photo-1593642632823-8f785ba67e45',
            ],
            [
                'category' => 'Laptop',
                'name' => 'Lenovo ThinkPad E14',
                'description' => 'Laptop bisnis dengan keyboard ergonomis, konstruksi kokoh, dan performa andal untuk kebutuhan profesional.',
                'price' => 12500000,
                'stock' => 12,
                'image' => 'photo-1498050108023-c5249f4df085',
            ],

            // SMARTPHONE
            [
                'category' => 'Smartphone',
                'name' => 'iPhone 15',
                'description' => 'Smartphone Apple dengan chip A16 Bionic, kamera utama 48MP, Dynamic Island, dan USB-C.',
                'price' => 12500000,
                'stock' => 18,
                'image' => 'photo-1592899677977-9c10ca588bbd',
            ],
            [
                'category' => 'Smartphone',
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Smartphone flagship Samsung dengan kamera 200MP, S Pen, layar Dynamic AMOLED 2X, dan fitur Galaxy AI.',
                'price' => 19500000,
                'stock' => 10,
                'image' => 'photo-1511707171634-5f897ff02aa9',
            ],
            [
                'category' => 'Smartphone',
                'name' => 'Google Pixel 9',
                'description' => 'Smartphone Google dengan pengalaman Android, kamera computational photography, dan fitur AI.',
                'price' => 14000000,
                'stock' => 9,
                'image' => 'photo-1512499617640-c74ae3a79d37',
            ],
            [
                'category' => 'Smartphone',
                'name' => 'Xiaomi 14T',
                'description' => 'Smartphone dengan kamera Leica, layar AMOLED 144Hz, dan performa tinggi.',
                'price' => 6500000,
                'stock' => 25,
                'image' => 'photo-1598327105666-5b89351aff97',
            ],
            [
                'category' => 'Smartphone',
                'name' => 'Samsung Galaxy A55',
                'description' => 'Smartphone kelas menengah dengan layar Super AMOLED, kamera stabil, dan desain premium.',
                'price' => 5500000,
                'stock' => 30,
                'image' => 'photo-1605236453806-6ff36851218e',
            ],

            // TABLET
            [
                'category' => 'Tablet',
                'name' => 'iPad Air M2',
                'description' => 'Tablet Apple dengan chip M2, layar Liquid Retina, dan dukungan Apple Pencil.',
                'price' => 11000000,
                'stock' => 14,
                'image' => 'photo-1544244015-0df4b3ffc6b0',
            ],
            [
                'category' => 'Tablet',
                'name' => 'iPad Pro M4',
                'description' => 'Tablet profesional Apple dengan layar Ultra Retina XDR OLED dan chip M4.',
                'price' => 19000000,
                'stock' => 7,
                'image' => 'photo-1589739900243-4b52cd9b104e',
            ],
            [
                'category' => 'Tablet',
                'name' => 'Samsung Galaxy Tab S9',
                'description' => 'Tablet Android dengan layar Dynamic AMOLED 2X, S Pen, dan performa Snapdragon.',
                'price' => 10500000,
                'stock' => 11,
                'image' => 'photo-1561154464-82e9adf32764',
            ],
            [
                'category' => 'Tablet',
                'name' => 'Xiaomi Pad 6',
                'description' => 'Tablet dengan layar 144Hz, prosesor Snapdragon, dan empat speaker.',
                'price' => 4500000,
                'stock' => 22,
                'image' => 'photo-1585790050230-5dd28404ccb9',
            ],

            // KOMPUTER
            [
                'category' => 'Komputer',
                'name' => 'Mac Mini M4',
                'description' => 'Komputer desktop ultra-kompak Apple dengan chip M4 yang menawarkan performa tinggi dalam ukuran minimalis.',
                'price' => 10000000,
                'stock' => 10,
                'image' => 'photo-1593640408182-31c70c8268f5',
            ],
            [
                'category' => 'Komputer',
                'name' => 'Intel NUC 13 Pro',
                'description' => 'Mini PC dengan prosesor Intel Core generasi ke-13 untuk produktivitas dan kebutuhan kantor.',
                'price' => 8500000,
                'stock' => 7,
                'image' => 'photo-1587831990711-23ca6441447b',
            ],
            [
                'category' => 'Komputer',
                'name' => 'ASUS ROG NUC',
                'description' => 'Mini PC gaming dengan komponen performa tinggi dalam desain desktop ringkas.',
                'price' => 28000000,
                'stock' => 4,
                'image' => 'photo-1587202372775-e229f172b9d7',
            ],

            // MONITOR
            [
                'category' => 'Monitor',
                'name' => 'LG UltraGear 27GN800',
                'description' => 'Monitor gaming 27 inci dengan resolusi QHD, panel IPS, dan refresh rate 144Hz.',
                'price' => 4500000,
                'stock' => 13,
                'image' => 'photo-1527443224154-c4a3942d3acf',
            ],
            [
                'category' => 'Monitor',
                'name' => 'Samsung Odyssey G5',
                'description' => 'Monitor gaming curved dengan resolusi QHD, refresh rate tinggi, dan desain immersive.',
                'price' => 5200000,
                'stock' => 8,
                'image' => 'photo-1527443224154-c4a3942d3acf',
            ],
            [
                'category' => 'Monitor',
                'name' => 'Dell UltraSharp U2723QE',
                'description' => 'Monitor profesional 27 inci dengan resolusi 4K UHD dan teknologi IPS Black.',
                'price' => 9500000,
                'stock' => 5,
                'image' => 'photo-1593640408182-31c70c8268f5',
            ],

            // AKSESORIS
            [
                'category' => 'Aksesoris',
                'name' => 'Logitech MX Master 3S',
                'description' => 'Mouse wireless profesional dengan sensor 8000 DPI, scroll MagSpeed, dan tombol senyap.',
                'price' => 1500000,
                'stock' => 25,
                'image' => 'photo-1527814050087-3793815479db',
            ],
            [
                'category' => 'Aksesoris',
                'name' => 'Logitech MX Keys S',
                'description' => 'Keyboard wireless premium dengan tombol low-profile, backlight pintar, dan pengalaman mengetik nyaman.',
                'price' => 1800000,
                'stock' => 17,
                'image' => 'photo-1587829741301-dc798b83add3',
            ],
            [
                'category' => 'Aksesoris',
                'name' => 'Keychron K2 Pro',
                'description' => 'Mechanical keyboard wireless dengan layout compact 75%, hot-swappable switch, dan RGB backlight.',
                'price' => 1600000,
                'stock' => 20,
                'image' => 'photo-1595225476474-87563907a212',
            ],
            [
                'category' => 'Aksesoris',
                'name' => 'Razer DeathAdder V3',
                'description' => 'Gaming mouse ergonomis dengan sensor optik presisi tinggi dan desain ringan.',
                'price' => 950000,
                'stock' => 30,
                'image' => 'photo-1615663245857-ac93bb7c39e7',
            ],

            // AUDIO
            [
                'category' => 'Audio',
                'name' => 'Sony WH-1000XM5',
                'description' => 'Headphone wireless premium dengan active noise cancelling dan kualitas audio resolusi tinggi.',
                'price' => 4500000,
                'stock' => 12,
                'image' => 'photo-1505740420928-5e560c06d30e',
            ],
            [
                'category' => 'Audio',
                'name' => 'Apple AirPods Pro 2',
                'description' => 'Earbuds wireless dengan active noise cancellation, transparency mode, dan audio spatial.',
                'price' => 3800000,
                'stock' => 16,
                'image' => 'photo-1606220945770-b5b6c2c55bf1',
            ],
            [
                'category' => 'Audio',
                'name' => 'JBL Flip 6',
                'description' => 'Speaker Bluetooth portabel dengan suara bertenaga, desain tahan air, dan baterai untuk penggunaan outdoor.',
                'price' => 1600000,
                'stock' => 19,
                'image' => 'photo-1608043152269-423dbba4e7e1',
            ],

            // STORAGE
            [
                'category' => 'Storage',
                'name' => 'Samsung 990 PRO 1TB',
                'description' => 'SSD NVMe PCIe 4.0 dengan kecepatan baca dan tulis tinggi untuk gaming dan pekerjaan profesional.',
                'price' => 2100000,
                'stock' => 15,
                'image' => 'photo-1597872200969-2b65d5f1c3a3',
            ],
            [
                'category' => 'Storage',
                'name' => 'Kingston NV2 1TB',
                'description' => 'SSD NVMe PCIe 4.0 dengan kapasitas 1TB untuk meningkatkan performa dan kapasitas penyimpanan komputer.',
                'price' => 950000,
                'stock' => 28,
                'image' => 'photo-1531492746076-161ca9bcad58',
            ],
            [
                'category' => 'Storage',
                'name' => 'SanDisk Extreme Portable SSD',
                'description' => 'SSD eksternal portabel dengan desain ringkas dan ketahanan untuk penggunaan outdoor.',
                'price' => 1800000,
                'stock' => 14,
                'image' => 'photo-1591488320449-011701bb6704',
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Insert Products
        |--------------------------------------------------------------------------
        */

        foreach ($products as $item) {
            $product = Product::query()->firstOrCreate(
                [
                    'slug' => Str::slug($item['name']),
                ],
                [
                    'user_id' => 1,
                    'category_id' => $categoryIds[$item['category']],
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                ]
            );

            $imageUrl = 'https://images.unsplash.com/'
                . $item['image']
                . '?auto=format&fit=crop&w=800&q=80';

            $product->product_images()->firstOrCreate([
                'image' => $imageUrl,
            ]);
        }
    }
}
