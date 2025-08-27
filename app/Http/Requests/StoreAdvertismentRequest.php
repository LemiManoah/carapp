<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdvertismentRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'allows_bidding' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'car_id.required' => 'Car is required.',
            'car_id.exists' => 'Selected car does not exist.',
            'user_id.required' => 'User is required.',
            'user_id.exists' => 'Selected user does not exist.',
            'title.required' => 'Title is required.',
            'title.max' => 'Title must be at most 255 characters.',
            'description.string' => 'Description must be a string.',
            'is_active.boolean' => 'Is active must be a boolean.',
            'allows_bidding.boolean' => 'Allows bidding must be a boolean.',
        ];
    }
}
