<?php

use App\Http\Controllers\BrandController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix(config('app.admin_url', 'admin'))->middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('support', 'support/index')->name('support');
    Route::get('brands', [BrandController::class, 'index'])->name('brands.index');
    Route::post('brands/{brand}/toggle-show-on-website', [BrandController::class, 'toggleShowOnWebsite'])->name('brands.toggle-show-on-website');
});

require __DIR__.'/settings.php';
