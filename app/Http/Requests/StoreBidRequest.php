<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBidRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'car_id' => ['required', 'integer', 'exists:cars,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'bid_price' => ['required', 'numeric', 'min:0'],
            'bid_status' => ['nullable', 'in:Pending,Accepted,Rejected,Withdrawn'],
        ];
    }

    public function messages(): array
    {
        return [
            'car_id.required' => 'Car is required.',
            'car_id.exists' => 'Selected car does not exist.',
            'user_id.required' => 'User is required.',
            'user_id.exists' => 'Selected user does not exist.',
            'bid_price.required' => 'Bid price is required.',
            'bid_price.numeric' => 'Bid price must be a number.',
            'bid_status.in' => 'Bid status must be one of: Pending, Accepted, Rejected, Withdrawn.',
        ];
    }
}
