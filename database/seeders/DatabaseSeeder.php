<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use App\Models\User;
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

        $user = User::query()->create([
            'email' => 'ican@ade.com',
            'password' => 'icanganteng123',
        ]);
        Pelanggan::query()->create([
            'user_id' => $user->id,
            'name' => 'icannnnnnn'
        ]);
    }
}
