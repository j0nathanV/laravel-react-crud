<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class ClienteController extends Controller
{
    // Listar clientes
    public function index()
    {
        return response()->json(Cliente::all());
    }

    // Crear cliente
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('clientes', 'email'),
            ],
            'telefono' => 'nullable|string|max:20',
        ]);

        $cliente = Cliente::create($validated);
        return response()->json($cliente, 201);
    }

    // Eliminar cliente
    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();
        return response()->json(null, 204);
    }
}
