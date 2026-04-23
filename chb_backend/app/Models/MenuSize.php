<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuSize extends Model
{
    /** @use HasFactory<\Database\Factories\MenuSizeFactory> */
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'size',
        'price'
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}
