<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'min:3',
                'max:20',
                'regex:/^(?=.*[A-Za-z])[A-Za-z0-9_]+$/',
            ],
            'address' => [
                'required',
                'string',
            ],
            'phone_number' => [
                'required',
                'string',
                'regex:/^\+?[0-9]{7,15}$/',
            ],
            'email' => [
                'required',
                'email',
                'unique:users,email,' . $this->user()->id
            ]
        ];
    }
}