<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarRequest extends FormRequest
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
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:255',
            'body_type' => 'required|string|max:50',
            'car_type' => 'required|string|max:50',
            'year' => 'required|integer',
            'price' => 'required|numeric',
            'mileage' => 'nullable|integer',
            'fuel_type' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            // images[]: optional multiple images
            'images' => 'nullable|array',
            'images.*' => 'file|image|mimes:jpeg,png,webp|max:5120', // 5MB per image
        ];
    }

    public function messages(): array
    {
        return [
            'brand.required' => 'The brand field is required.',
            'model.required' => 'The model field is required.',
            'body_type.required' => 'The body type field is required.',
            'car_type.required' => 'The car type field is required.',
            'year.required' => 'The year field is required.',
            'price.required' => 'The price field is required.',
            // Optional fields shouldn't have required messages
            'images.array' => 'Images must be an array of files.',
            'images.*.image' => 'Each file must be an image.',
            'images.*.mimes' => 'Images must be JPEG, PNG, or WEBP.',
            'images.*.max' => 'Each image may not be greater than 5MB.',
        ];
    }
}

