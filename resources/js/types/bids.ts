export interface Bid {
    id: number;
    car_id: number;
    user_id: number;
    bid_price: number;
    bid_status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: number;
    updated_by: number;
    deleted_by: number;
    // Eager-loaded relations
    car?: { id: number; brand?: string; model?: string; [key: string]: unknown } | null;
    user?: { id: number; name?: string; email?: string; [key: string]: unknown } | null;
    [key: string]: unknown;
}
