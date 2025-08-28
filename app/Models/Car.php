<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia; 
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\User;
use Spatie\Image\Enums\Fit;

class Car extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\CarFactory> */
    use HasFactory, SoftDeletes, InteractsWithMedia;

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
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'year' => 'integer',
        'mileage' => 'integer',
    ];

    protected $appends = [
        'thumb_url',
        'images',
        'media_items',
    ];

    public function advertisements()
    {
        return $this->hasMany(Advertisment::class);
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

    public static function scopeCreatedBy($query, User $user)
    {
        return $query->where('created_by', $user->id);
    }

    public static function scopeUpdatedBy($query, User $user)
    {
        return $query->where('updated_by', $user->id);
    }

    public static function scopeDeletedBy($query, User $user)
    {
        return $query->where('deleted_by', $user->id);
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

    /**
     * Register the media collections for the car.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useDisk('public')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();
    }

    /**
     * Define media conversions (e.g., thumbnail) for images.
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 300, 200)
            ->nonQueued();
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors for Inertia/JSON
    |--------------------------------------------------------------------------
    */
    public function getThumbUrlAttribute(): ?string
    {
        // Prefer the most recently uploaded image as the primary thumb
        $media = $this->getMedia('images')->last();
        return $media ? $media->getUrl('thumb') : null;
    }

    public function getImagesAttribute(): array
    {
        return $this->getMedia('images')->map(fn ($m) => $m->getUrl())->all();
    }

    public function getMediaItemsAttribute(): array
    {
        return $this->getMedia('images')->map(fn ($m) => [
            'id' => $m->id,
            'url' => $m->getUrl(),
            'thumb_url' => $m->getUrl('thumb'),
        ])->all();
    }
}
