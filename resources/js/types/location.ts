export interface Location {
    id: number;
    city_name: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}