<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Pelanggan;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $userAdmin = User::query()->create([
            'email' => 'ican@admin.com',
            'password' => 'icanganteng123',
            'role' => 'admin'
        ]);
        Admin::query()->create([
            'user_id' => $userAdmin->id,
            'name' => 'icannnnnnn'
        ]);
        $user = User::query()->create([
            'email' => 'ican@awan.com',
            'password' => 'icantik123',
            'role' => 'pelanggan'
        ]);
        Pelanggan::query()->create([
            'user_id' => $user->id,
            'name' => 'ikhsannn'
        ]);
        $kurirJne = User::query()->create([
            'email' => 'kurir12@jne.com',
            'password' => 'kurir123321',
            'role' => 'supplier'
        ]);
        $kurirJnt = User::query()->create([
            'email' => 'kurir@jnt.com',
            'password' => 'kurirjnt123321',
            'role' => 'supplier'
        ]);
        Supplier::query()->create([
            'user_id' => $kurirJnt->id,
            'name' => 'kurir jnt'
        ]);
        Supplier::query()->create([
            'user_id' => $kurirJne->id,
            'name' => 'kurir jne'
        ]);
        $product = new ProductSeeder();
        $product->run();
        // $category = Category::query()->create([
        //     'name' => 'laptop',
        //     'description' => 'Digital'
        // ]);

        // $product = Product::query()->create([
        //     'user_id' => 1,
        //     'category_id' => $category->id,
        //     'name' => 'Macbook Air M2',
        //     'description' => 'MacBook Air M2 adalah laptop tipis dan ringan dari Apple yang ditenagai oleh chip Apple M2 (CPU 8-core dan pilihan GPU 8-core hingga 10-core) yang menawarkan peningkatan performa serta efisiensi daya luar biasa dibanding generasi sebelumnya.',
        //     'price' => 15000000,
        //     'stock' => 100,
        //     'slug' => Str::slug('Macbook Air M2')
        // ]);
        // $product->product_images()->createMany([
        //     ['image' => '/image/macbook-air-m2.webp'],
        //     ['image' => '/image/macbook-air-m2.webp'],
        //     ['image' => '/image/macbook-air-m2.webp'],
        //     ['image' => '/image/macbook-air-m2.webp'],
        // ]);
        // $productMacMini = Product::query()->create([
        //     'user_id' => 1,
        //     'category_id' => $category->id,
        //     'name' => 'Mac Mini M4',
        //     'description' => 'Mac Mini M4 adalah komputer desktop ultra-kompak terbaru dari Apple yang menghadirkan perubahan desain terbesar dalam belasan tahun terakhir dengan ukuran bodi yang jauh lebih kecil, yakni hanya 5 x 5 inci. Ditenagai oleh chip Apple M4 (atau M4 Pro untuk varian performa tinggi), komputer mungil ini menawarkan lompatan kinerja CPU dan GPU yang luar biasa serta efisiensi daya yang membuat suhunya tetap dingin meski menangani beban kerja berat seperti penyuntingan video 8K atau pemrograman.',
        //     'price' => 10000000,
        //     'stock' => 100,
        //     'slug' => Str::slug('Mac Mini M4')
        // ]);
        // $productMacMini->product_images()->createMany([
        //     ['image' => '/image/mac-mini.jpeg'],
        //     ['image' => '/image/mac-mini.jpeg'],
        //     ['image' => '/image/mac-mini.jpeg'],
        //     ['image' => '/image/mac-mini.jpeg'],
        // ]);
    }
}
