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
        ];
    }
}
