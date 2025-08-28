<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCarRequest extends FormRequest
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
            'brand' => 'sometimes|required|string|max:100',
            'model' => 'sometimes|required|string|max:255',
            'body_type' => 'sometimes|required|string|max:50',
            'car_type' => 'sometimes|required|string|max:50',
            'year' => 'sometimes|required|integer',
            'price' => 'sometimes|required|numeric',
            'mileage' => 'nullable|integer',
            'fuel_type' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            // new images to add
            'images' => 'nullable|array',
            'images.*' => 'file|image|mimes:jpeg,png,webp|max:5120',
            // existing media ids to remove
            'removed_media_ids' => 'nullable|array',
            'removed_media_ids.*' => 'integer',
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
            'mileage.required' => 'The mileage field is required.',
            'fuel_type.required' => 'The fuel type field is required.',
            'color.required' => 'The color field is required.',
            'images.required' => 'The images field is required.',
            'removed_media_ids.required' => 'The removed media ids field is required.',
        ];
    }
}
