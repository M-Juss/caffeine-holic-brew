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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'in:Coffee,Non Coffee,Pastries,Snacks'],
            'is_available' => ['required', 'boolean'],
            'sizes' => ['required', 'array', 'min:1'],
            'sizes.*.name' => ['required', 'string', 'max:255'],
            'sizes.*.price' => ['required', 'numeric', 'min:0.01'],
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
            'category.required' => 'Category is required.',
            'category.in' => 'Category must be Coffee, Non Coffee, Pastries, or Snacks.',
            'is_available.required' => 'Availability is required.',
            'is_available.boolean' => 'Availability must be true or false.',

            'sizes.required' => 'Please provide at least one size option.',
            'sizes.array' => 'Sizes must be in a valid format.',
            'sizes.min' => 'Please provide at least one size option.',

            'sizes.*.name.required' => 'Each size must have a name.',
            'sizes.*.price.required' => 'Each size must have a price.',
            'sizes.*.price.numeric' => 'Price must be a valid number.',
            'sizes.*.price.min' => 'Price must be greater than zero.',
        ];
    }
}
