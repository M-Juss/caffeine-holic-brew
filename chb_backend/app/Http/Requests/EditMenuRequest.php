<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EditMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],

            'name' => ['sometimes', 'string'],
            'description' => ['sometimes', 'string'],

            'category' => ['sometimes', 'string', 'in:Coffee,Non Coffee,Pastries,Snacks'],
            'is_available' => ['sometimes', 'boolean'],

            'sizes' => ['sometimes', 'array'],

            'sizes.*.menu' => ['required_with:sizes', 'string'],
            'sizes.*.price' => ['required_with:sizes', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.image' => 'The uploaded file must be a valid image.',
            'image.mimes' => 'Only PNG, JPG, and JPEG formats are allowed.',

            'name.string' => 'Menu name must be a valid string.',
            'description.string' => 'Description must be a valid string.',

            'sizes.array' => 'Sizes must be in a valid format.',

            'sizes.*.menu.required_with' => 'Each size must have a name when sizes are provided.',
            'sizes.*.menu.string' => 'Size name must be a valid string.',

            'sizes.*.price.required_with' => 'Each size must have a price when sizes are provided.',
            'sizes.*.price.numeric' => 'Price must be a valid number.',
        ];
    }
}
