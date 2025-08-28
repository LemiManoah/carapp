export interface Car {
    id: number;
    brand: string;
    model: string;
    body_type: 'MPV' | 'SUV' | 'Van' | 'Sedan' | 'Hatchback' | 'Wagon' | 'Coupe' | 'Convertible';
    car_type: 'Manual' | 'Automatic';
    year: number;
    price: number;
    mileage: number;
    fuel_type: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | null;
    color: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: number;
    updated_by: number;
    deleted_by: number;
    [key: string]: unknown;
}