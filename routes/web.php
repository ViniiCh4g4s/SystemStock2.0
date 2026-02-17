<?php

use App\Http\Controllers\StockItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [StockItemController::class, 'index'])->name('home');
Route::post('/stock', [StockItemController::class, 'store'])->name('stock.store');
Route::post('/stock/{stockItem}', [StockItemController::class, 'update'])->name('stock.update');
Route::patch('/stock/{stockItem}/qty', [StockItemController::class, 'updateQty'])->name('stock.updateQty');
Route::delete('/stock/{stockItem}', [StockItemController::class, 'destroy'])->name('stock.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
