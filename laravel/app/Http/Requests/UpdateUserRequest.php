<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateUserRequest extends FormRequest
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
        $userId = Auth::id();

        return [
            'name' => 'sometimes|string|min:3',
            'email' => [
                'sometimes',
                'email',
                'unique:App\Models\User,email,' . $userId,
            ],
            'nickname' => [
                'sometimes',
                'string',
                'min:3',
                'unique:App\Models\User,nickname,' . $userId,
            ],
            'password' => 'nullable|string|min:3',
            'confirmPassword' => 'nullable|string|min:3|same:password|required_if:password,!,'
        ];
    }


    public function messages()
    {
        return [
            'confirmPassword.required_if' => 'Password and confirm password must match and both are required when updating password.',
            'confirmPassword.same' => 'Password and confirm password must match and both are required when updating password.'
        ];
    }


}
