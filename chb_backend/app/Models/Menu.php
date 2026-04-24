<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    /** @use HasFactory<\Database\Factories\MenuFactory> */
    use HasFactory;

    protected $fillable = [
        'image_path',
        'name',
        'description',
        'is_available',
        'category',
    ];

    public function sizes(): HasMany
    {
        return $this->hasMany(MenuSize::class);
    }
}
 