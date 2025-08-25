# Used Car Sales Website Database Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Database Design](#database-design)
3. [Implementation Steps](#implementation-steps)
4. [Laravel-Specific Implementation](#laravel-specific-implementation)
5. [API Development](#api-development)
6. [Frontend Integration](#frontend-integration)
7. [Testing Strategy](#testing-strategy)
8. [Improvement Suggestions](#improvement-suggestions)
9. [Deployment Considerations](#deployment-considerations)

## Project Overview

### Objective
Building a relational database for a used car sales website where users can:
- List multiple used cars for sale
- Complete profile information (name, contact, location)
- Create detailed advertisements with car specifications
- Search cars by location, brand, and body type
- Bid on cars when sellers enable bidding
- Complete transactions outside the application

### Key Features
- User registration and profile management
- Car listing and advertisement system
- Advanced search and filtering
- Bidding system
- Location-based services
- Contact management

## Database Design

### Entity Relationship Diagram (ERD)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Users     │    │  Locations  │    │    Cars     │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ name        │    │ city_name   │    │ brand       │
│ email       │    │ latitude    │    │ model       │
│ password    │    │ longitude   │    │ body_type   │
│ contact     │    │ created_at  │    │ car_type    │
│ location_id │────│ updated_at  │    │ year        │
│ created_at  │    └─────────────┘    │ price       │
│ updated_at  │                       │ created_at  │
└─────────────┘                       │ updated_at  │
        │                              └─────────────┘
        │                                      │
        │                              ┌─────────────┐
        │                              │Advertisements│
        │                              ├─────────────┤
        │                              │ id (PK)     │
        │                              │ car_id      │
        │                              │ user_id     │
        │                              │ title       │
        │                              │ description │
        │                              │ is_active   │
        │                              │ created_at  │
        │                              │ updated_at  │
        │                              └─────────────┘
        │                                      │
        │                              ┌─────────────┐
        │                              │    Bids     │
        │                              ├─────────────┤
        │                              │ id (PK)     │
        │                              │ car_id      │
        │                              │ user_id     │
        │                              │ bid_price   │
        │                              │ bid_status  │
        │                              │ created_at  │
        │                              │ updated_at  │
        │                              └─────────────┘
        │
        └──────────────────────────────┘
```

### Database Schema

#### 1. Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    location_id BIGINT UNSIGNED NOT NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id)
);
```

#### 2. Locations Table
```sql
CREATE TABLE locations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### 3. Cars Table
```sql
CREATE TABLE cars (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(255) NOT NULL,
    body_type ENUM('MPV', 'SUV', 'Van', 'Sedan', 'Hatchback', 'Wagon', 'Coupe', 'Convertible') NOT NULL,
    car_type ENUM('Manual', 'Automatic') NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    mileage INT NULL,
    fuel_type ENUM('Petrol', 'Diesel', 'Hybrid', 'Electric') NULL,
    color VARCHAR(50) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### 4. Advertisements Table
```sql
CREATE TABLE advertisements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    car_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    allows_bidding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 5. Bids Table
```sql
CREATE TABLE bids (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    car_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    bid_price DECIMAL(12, 2) NOT NULL,
    bid_status ENUM('Pending', 'Accepted', 'Rejected', 'Withdrawn') DEFAULT 'Pending',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Implementation Steps

### Step 1: Create Migrations

#### 1.1 Locations Migration
```bash
php artisan make:migration create_locations_table
```

#### 1.2 Cars Migration
```bash
php artisan make:migration create_cars_table
```

#### 1.3 Update Users Migration
```bash
php artisan make:migration add_location_and_contact_to_users_table
```

#### 1.4 Advertisements Migration
```bash
php artisan make:migration create_advertisements_table
```

#### 1.5 Bids Migration
```bash
php artisan make:migration create_bids_table
```

### Step 2: Create Models

#### 2.1 Location Model
```bash
php artisan make:model Location
```

#### 2.2 Car Model
```bash
php artisan make:model Car
```

#### 2.3 Advertisement Model
```bash
php artisan make:model Advertisement
```

#### 2.4 Bid Model
```bash
php artisan make:model Bid
```

### Step 3: Create Factories and Seeders

#### 3.1 Factories
```bash
php artisan make:factory LocationFactory
php artisan make:factory CarFactory
php artisan make:factory AdvertisementFactory
php artisan make:factory BidFactory
```

#### 3.2 Seeders
```bash
php artisan make:seeder LocationSeeder
php artisan make:seeder CarSeeder
php artisan make:seeder AdvertisementSeeder
php artisan make:seeder BidSeeder
```
