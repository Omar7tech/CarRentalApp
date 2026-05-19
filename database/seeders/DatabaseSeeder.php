<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::updateOrCreate([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => 'password',
        ]);

        $this->call([BrandSeeder::class]);
    }
}
