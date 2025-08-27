<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Car extends Model
{
    /** @use HasFactory<\Database\Factories\CarFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'brand',
        'model',
        'body_type',
        'car_type',
        'year',
        'price',
        'mileage',
        'fuel_type',
        'color',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'year' => 'integer',
        'mileage' => 'integer',
    ];

    public function advertisements()
    {
        return $this->hasMany(Advertisement::class);
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    public function scopeByBrand($query, string $brand)
    {
        return $query->where('brand', 'like', "%{$brand}%");
    }

    public function scopeByBodyType($query, string $bodyType)
    {
        return $query->where('body_type', $bodyType);
    }

    public function scopeByYearRange($query, int $minYear, int $maxYear)
    {
        return $query->whereBetween('year', [$minYear, $maxYear]);
    }

    public function scopeByPriceRange($query, float $minPrice, float $maxPrice)
    {
        return $query->whereBetween('price', [$minPrice, $maxPrice]);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
