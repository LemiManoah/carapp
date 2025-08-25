# Laravel Implementation Guide for Used Car Sales Database

## Laravel-Specific Implementation

### 1. Migration Files

#### locations_table.php
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('city_name', 100);
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->timestamps();
            
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
```

#### cars_table.php
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('brand', 100);
            $table->string('model', 255);
            $table->enum('body_type', ['MPV', 'SUV', 'Van', 'Sedan', 'Hatchback', 'Wagon', 'Coupe', 'Convertible']);
            $table->enum('car_type', ['Manual', 'Automatic']);
            $table->integer('year');
            $table->decimal('price', 12, 2);
            $table->integer('mileage')->nullable();
            $table->enum('fuel_type', ['Petrol', 'Diesel', 'Hybrid', 'Electric'])->nullable();
            $table->string('color', 50)->nullable();
            $table->timestamps();
            
            $table->index(['brand', 'model']);
            $table->index(['body_type', 'car_type']);
            $table->index('year');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
```

#### advertisements_table.php
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('allows_bidding')->default(false);
            $table->timestamps();
            
            $table->index(['is_active', 'created_at']);
            $table->index('allows_bidding');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};
```

#### bids_table.php
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('bid_price', 12, 2);
            $table->enum('bid_status', ['Pending', 'Accepted', 'Rejected', 'Withdrawn'])->default('Pending');
            $table->timestamps();
            
            $table->index(['car_id', 'bid_status']);
            $table->index('bid_price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bids');
    }
};
```

### 2. Model Files

#### Location.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_name',
        'latitude',
        'longitude',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function advertisements(): HasMany
    {
        return $this->hasManyThrough(Advertisement::class, User::class);
    }
}
```

#### Car.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;

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

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'year' => 'integer',
            'mileage' => 'integer',
        ];
    }

    public function advertisements(): HasMany
    {
        return $this->hasMany(Advertisement::class);
    }

    public function bids(): HasMany
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
}
```

#### Advertisement.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Advertisement extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'user_id',
        'title',
        'description',
        'is_active',
        'allows_bidding',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'allows_bidding' => 'boolean',
        ];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class, 'car_id', 'car_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAllowsBidding($query)
    {
        return $query->where('allows_bidding', true);
    }
}
```

#### Bid.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'user_id',
        'bid_price',
        'bid_status',
    ];

    protected function casts(): array
    {
        return [
            'bid_price' => 'decimal:2',
        ];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('bid_status', 'Pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('bid_status', 'Accepted');
    }
}
```

### 3. Update User Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'contact',
        'location_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function advertisements(): HasMany
    {
        return $this->hasMany(Advertisement::class);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }
}
```

### 4. Factory Files

#### LocationFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'city_name' => fake()->city(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
        ];
    }
}
```

#### CarFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

class CarFactory extends Factory
{
    protected $model = Car::class;

    public function definition(): array
    {
        $brands = ['Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Ford', 'BMW', 'Mercedes-Benz'];
        $bodyTypes = ['MPV', 'SUV', 'Van', 'Sedan', 'Hatchback', 'Wagon', 'Coupe', 'Convertible'];
        $carTypes = ['Manual', 'Automatic'];
        $fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
        $colors = ['White', 'Black', 'Silver', 'Red', 'Blue', 'Green', 'Yellow', 'Gray'];

        return [
            'brand' => fake()->randomElement($brands),
            'model' => fake()->word() . ' ' . fake()->word(),
            'body_type' => fake()->randomElement($bodyTypes),
            'car_type' => fake()->randomElement($carTypes),
            'year' => fake()->numberBetween(2000, 2024),
            'price' => fake()->numberBetween(50000000, 500000000),
            'mileage' => fake()->numberBetween(1000, 200000),
            'fuel_type' => fake()->randomElement($fuelTypes),
            'color' => fake()->randomElement($colors),
        ];
    }
}
```

### 5. Seeder Files

#### DatabaseSeeder.php
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            LocationSeeder::class,
            CarSeeder::class,
            UserSeeder::class,
            AdvertisementSeeder::class,
            BidSeeder::class,
        ]);
    }
}
```

## API Development

### 1. Controllers

#### CarController.php
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Http\Requests\CarSearchRequest;
use Illuminate\Http\JsonResponse;

class CarController extends Controller
{
    public function search(CarSearchRequest $request): JsonResponse
    {
        $query = Car::query()
            ->with(['advertisements.user.location']);

        // Apply filters
        if ($request->filled('brand')) {
            $query->byBrand($request->brand);
        }

        if ($request->filled('body_type')) {
            $query->byBodyType($request->body_type);
        }

        if ($request->filled('min_year') && $request->filled('max_year')) {
            $query->byYearRange($request->min_year, $request->max_year);
        }

        if ($request->filled('min_price') && $request->filled('max_price')) {
            $query->byPriceRange($request->min_price, $request->max_price);
        }

        if ($request->filled('location_id')) {
            $query->whereHas('advertisements.user', function ($q) use ($request) {
                $q->where('location_id', $request->location_id);
            });
        }

        $cars = $query->paginate(20);

        return response()->json($cars);
    }

    public function show(Car $car): JsonResponse
    {
        $car->load(['advertisements.user.location', 'bids.user']);

        return response()->json($car);
    }
}
```

#### AdvertisementController.php
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Http\Requests\AdvertisementRequest;
use Illuminate\Http\JsonResponse;

class AdvertisementController extends Controller
{
    public function index(): JsonResponse
    {
        $advertisements = Advertisement::with(['car', 'user.location'])
            ->active()
            ->latest()
            ->paginate(20);

        return response()->json($advertisements);
    }

    public function store(AdvertisementRequest $request): JsonResponse
    {
        $advertisement = Advertisement::create([
            'car_id' => $request->car_id,
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'allows_bidding' => $request->allows_bidding,
        ]);

        $advertisement->load(['car', 'user.location']);

        return response()->json($advertisement, 201);
    }

    public function show(Advertisement $advertisement): JsonResponse
    {
        $advertisement->load(['car', 'user.location', 'bids.user']);

        return response()->json($advertisement);
    }
}
```

#### BidController.php
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Car;
use App\Http\Requests\BidRequest;
use Illuminate\Http\JsonResponse;

class BidController extends Controller
{
    public function store(BidRequest $request, Car $car): JsonResponse
    {
        // Check if car allows bidding
        $advertisement = $car->advertisements()->where('allows_bidding', true)->first();
        
        if (!$advertisement) {
            return response()->json(['message' => 'Bidding not allowed for this car'], 422);
        }

        $bid = Bid::create([
            'car_id' => $car->id,
            'user_id' => auth()->id(),
            'bid_price' => $request->bid_price,
        ]);

        $bid->load('user');

        return response()->json($bid, 201);
    }

    public function update(BidRequest $request, Bid $bid): JsonResponse
    {
        $this->authorize('update', $bid);

        $bid->update([
            'bid_status' => $request->bid_status,
        ]);

        return response()->json($bid);
    }
}
```

### 2. Form Requests

#### CarSearchRequest.php
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CarSearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand' => 'nullable|string|max:100',
            'body_type' => 'nullable|in:MPV,SUV,Van,Sedan,Hatchback,Wagon,Coupe,Convertible',
            'min_year' => 'nullable|integer|min:1900|max:2024',
            'max_year' => 'nullable|integer|min:1900|max:2024|gte:min_year',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:min_price',
            'location_id' => 'nullable|exists:locations,id',
        ];
    }
}
```

#### AdvertisementRequest.php
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdvertisementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'car_id' => 'required|exists:cars,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'allows_bidding' => 'boolean',
        ];
    }
}
```

#### BidRequest.php
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bid_price' => 'required|numeric|min:0',
            'bid_status' => 'sometimes|in:Pending,Accepted,Rejected,Withdrawn',
        ];
    }
}
```

### 3. API Routes
```php
<?php

use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\AdvertisementController;
use App\Http\Controllers\Api\BidController;

Route::prefix('api')->group(function () {
    Route::get('/cars/search', [CarController::class, 'search']);
    Route::get('/cars/{car}', [CarController::class, 'show']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('advertisements', AdvertisementController::class);
        Route::post('/cars/{car}/bids', [BidController::class, 'store']);
        Route::patch('/bids/{bid}', [BidController::class, 'update']);
    });
});
```

## Testing Strategy

### 1. Feature Tests

#### CarSearchTest.php
```php
<?php

use App\Models\Car;
use App\Models\Location;
use App\Models\User;
use App\Models\Advertisement;

it('can search cars by brand', function () {
    $car = Car::factory()->create(['brand' => 'Toyota']);
    $user = User::factory()->create();
    Advertisement::factory()->create([
        'car_id' => $car->id,
        'user_id' => $user->id,
    ]);

    $response = $this->getJson('/api/cars/search?brand=Toyota');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

it('can search cars by location', function () {
    $location = Location::factory()->create();
    $user = User::factory()->create(['location_id' => $location->id]);
    $car = Car::factory()->create();
    Advertisement::factory()->create([
        'car_id' => $car->id,
        'user_id' => $user->id,
    ]);

    $response = $this->getJson("/api/cars/search?location_id={$location->id}");

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});
```

#### AdvertisementTest.php
```php
<?php

use App\Models\Car;
use App\Models\User;
use App\Models\Advertisement;

it('can create advertisement', function () {
    $user = User::factory()->create();
    $car = Car::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/advertisements', [
            'car_id' => $car->id,
            'title' => 'Great car for sale',
            'description' => 'Well maintained car',
            'allows_bidding' => true,
        ]);

    $response->assertCreated();
    $this->assertDatabaseHas('advertisements', [
        'car_id' => $car->id,
        'user_id' => $user->id,
        'title' => 'Great car for sale',
    ]);
});
```

### 2. Unit Tests

#### CarTest.php
```php
<?php

use App\Models\Car;

it('can filter by brand', function () {
    Car::factory()->create(['brand' => 'Toyota']);
    Car::factory()->create(['brand' => 'Honda']);

    $toyotas = Car::byBrand('Toyota')->get();

    expect($toyotas)->toHaveCount(1);
    expect($toyotas->first()->brand)->toBe('Toyota');
});

it('can filter by price range', function () {
    Car::factory()->create(['price' => 100000000]);
    Car::factory()->create(['price' => 200000000]);
    Car::factory()->create(['price' => 300000000]);

    $cars = Car::byPriceRange(150000000, 250000000)->get();

    expect($cars)->toHaveCount(1);
    expect($cars->first()->price)->toBe(200000000);
});
```

## Improvement Suggestions

### 1. Database Optimizations

#### Indexes
```sql
-- Add composite indexes for better query performance
CREATE INDEX idx_cars_brand_model ON cars(brand, model);
CREATE INDEX idx_cars_body_type_year ON cars(body_type, year);
CREATE INDEX idx_advertisements_active_created ON advertisements(is_active, created_at);
CREATE INDEX idx_bids_car_status ON bids(car_id, bid_status);
```

#### Soft Deletes
```php
// Add soft deletes to prevent data loss
use Illuminate\Database\Eloquent\SoftDeletes;

class Car extends Model
{
    use SoftDeletes;
    
    protected $dates = ['deleted_at'];
}
```

### 2. Additional Features

#### Image Management
```php
// Add image support for cars
Schema::table('cars', function (Blueprint $table) {
    $table->json('images')->nullable();
    $table->string('main_image')->nullable();
});
```

#### Favorites System
```php
// Create favorites table
Schema::create('favorites', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('car_id')->constrained()->onDelete('cascade');
    $table->timestamps();
    
    $table->unique(['user_id', 'car_id']);
});
```

#### Notifications
```php
// Add notification system for bids
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('type');
    $table->text('data');
    $table->timestamp('read_at')->nullable();
    $table->timestamps();
});
```

### 3. Performance Improvements

#### Caching
```php
// Cache popular searches
use Illuminate\Support\Facades\Cache;

public function search(CarSearchRequest $request): JsonResponse
{
    $cacheKey = 'car_search_' . md5(serialize($request->validated()));
    
    return Cache::remember($cacheKey, 300, function () use ($request) {
        // Search logic here
    });
}
```

#### Eager Loading
```php
// Optimize queries with eager loading
$cars = Car::with(['advertisements.user.location', 'bids.user'])
    ->whereHas('advertisements', function ($query) {
        $query->active();
    })
    ->get();
```

### 4. Security Enhancements

#### Rate Limiting
```php
// Add rate limiting to API endpoints
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/cars/{car}/bids', [BidController::class, 'store']);
});
```

#### Validation Rules
```php
// Enhanced validation
public function rules(): array
{
    return [
        'bid_price' => [
            'required',
            'numeric',
            'min:0',
            function ($attribute, $value, $fail) {
                $car = Car::find(request()->route('car'));
                if ($car && $value < $car->price * 0.8) {
                    $fail('Bid must be at least 80% of the car price.');
                }
            },
        ],
    ];
}
```

### 5. User Experience Improvements

#### Search Suggestions
```php
// Add search suggestions
public function suggestions(): JsonResponse
{
    $brands = Car::distinct()->pluck('brand');
    $models = Car::distinct()->pluck('model');
    $locations = Location::pluck('city_name');
    
    return response()->json([
        'brands' => $brands,
        'models' => $models,
        'locations' => $locations,
    ]);
}
```

#### Advanced Filtering
```php
// Add more filter options
public function advancedSearch(CarSearchRequest $request): JsonResponse
{
    $query = Car::query();
    
    // Add fuel type filter
    if ($request->filled('fuel_type')) {
        $query->where('fuel_type', $request->fuel_type);
    }
    
    // Add mileage filter
    if ($request->filled('max_mileage')) {
        $query->where('mileage', '<=', $request->max_mileage);
    }
    
    // Add color filter
    if ($request->filled('color')) {
        $query->where('color', $request->color);
    }
    
    return response()->json($query->paginate(20));
}
```

## Deployment Considerations

### 1. Environment Configuration
```bash
# Production environment variables
DB_CONNECTION=mysql
DB_HOST=production-db-host
DB_PORT=3306
DB_DATABASE=car_sales_db
DB_USERNAME=production_user
DB_PASSWORD=secure_password

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

### 2. Database Migration Strategy
```bash
# Run migrations in production
php artisan migrate --force

# Rollback if needed
php artisan migrate:rollback --step=1
```

### 3. Performance Monitoring
```php
// Add performance monitoring
use Illuminate\Support\Facades\DB;

DB::listen(function ($query) {
    if ($query->time > 100) {
        Log::warning('Slow query detected', [
            'sql' => $query->sql,
            'time' => $query->time,
        ]);
    }
});
```

### 4. Backup Strategy
```bash
# Database backup script
#!/bin/bash
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

This comprehensive Laravel implementation guide provides all the necessary code and best practices for building a robust used car sales website database.
