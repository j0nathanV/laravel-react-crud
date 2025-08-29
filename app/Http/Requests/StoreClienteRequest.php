<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'min:2',
                'max:255',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
                'regex:/^(?!.*(.)\1{3,})/u',
                'regex:/^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,})/u',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                'lowercase',
                Rule::unique('clientes', 'email'),
            ],
            'telefono' => [
                'nullable',
                'string',
                'min:8',
                'max:20',
                'regex:/^[0-9+\-\s()]+$/', 
                'regex:/^(?!.*(\d)\1{4,})/',
                'regex:/^(?!0+$)/', 
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'Name is required.',
            'nombre.min' => 'Name must be at least 2 characters.',
            'nombre.max' => 'Name may not be greater than 255 characters.',
            'nombre.regex' => 'Name format is invalid. Only letters and spaces are allowed.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email format is invalid.',
            'email.max' => 'Email may not be greater than 255 characters.',
            'email.unique' => 'This email is already registered.',
            'telefono.min' => 'Phone must be at least 8 digits.',
            'telefono.max' => 'Phone may not be greater than 20 characters.',
            'telefono.regex' => 'Phone format is invalid. Use only numbers.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower($this->email),
            'nombre' => ucwords(strtolower(trim($this->nombre))),
            'telefono' => preg_replace('/[^0-9+\-\s()]/', '', $this->telefono),
        ]);
    }
}
