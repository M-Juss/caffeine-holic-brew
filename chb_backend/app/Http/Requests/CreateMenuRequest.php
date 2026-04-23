<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:png,jpg,jpeg'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'sizes' => ['required', 'array'],
            'sizes.*.menu' => ['required', 'string'],
            'sizes.*.price' => ['required', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Please upload an image.',
            'image.image' => 'The file must be a valid image.',
            'image.mimes' => 'Only PNG, JPG, and JPEG formats are allowed.',

            'name.required' => 'Menu name is required.',
            'description.required' => 'Description is required.',

            'sizes.required' => 'Please provide at least one size option.',
            'sizes.array' => 'Sizes must be in a valid format.',

            'sizes.*.menu.required' => 'Each size must have a name.',
            'sizes.*.price.required' => 'Each size must have a price.',
            'sizes.*.price.numeric' => 'Price must be a valid number.',
        ];
    }
}
