<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockItem extends Model
{
    protected $fillable = [
        'name',
        'category',
        'qty',
        'min_qty',
        'location',
        'notes',
    ];

    protected $casts = [
        'qty' => 'integer',
        'min_qty' => 'integer',
    ];

    public function photos(): HasMany
    {
        return $this->hasMany(StockItemPhoto::class)->orderBy('sort_order');
    }
}
