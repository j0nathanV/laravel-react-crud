<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClienteRequest;
use App\Http\Resources\ClienteResource;
use App\Models\Cliente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClienteController extends Controller
{
    /**
     * Display a listing of clientes.
     */
    public function index(): AnonymousResourceCollection
    {
        $clientes = Cliente::latest()->get();

        return ClienteResource::collection($clientes);
    }

    /**
     * Store a newly created cliente.
     */
    public function store(StoreClienteRequest $request): JsonResponse
    {
        try {
            $cliente = Cliente::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Cliente creado exitosamente',
                'data' => new ClienteResource($cliente),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el cliente',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor',
            ], 500);
        }
    }

    /**
     * Remove the specified cliente from storage.
     */
    public function destroy(Cliente $cliente): JsonResponse
    {
        try {
            $cliente->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cliente eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el cliente',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor',
            ], 500);
        }
    }
}
