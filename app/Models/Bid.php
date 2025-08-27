<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bid extends Model
{
    /** @use HasFactory<\Database\Factories\BidFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'car_id',
        'user_id',
        'bid_price',
        'bid_status',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'bid_price' => 'decimal:2',
    ];

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeByStatus($query, string $status)
    {
        return $query->where('bid_status', $status);
    }

    public function scopeMinPrice($query, float $price)
    {
        return $query->where('bid_price', '>=', $price);
    }

    public function scopeMaxPrice($query, float $price)
    {
        return $query->where('bid_price', '<=', $price);
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
