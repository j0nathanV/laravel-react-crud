import { useCallback, useEffect, useState } from 'react';
import type { Cliente, ClienteInput, ApiResponse } from '../types';

export type { Cliente, ClienteInput };

export interface UseClientesReturn {
    clientes: Cliente[];
    allClientes: Cliente[];
    
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    
    createCliente: (cliente: ClienteInput) => Promise<boolean>;
    deleteCliente: (id: number) => Promise<boolean>;
    refreshClientes: () => Promise<void>;
    clearError: () => void;
    setPage: (page: number) => void;
    searchClientes: (searchTerm: string) => Cliente[];
    checkEmailExists: (email: string, excludeId?: number | null) => boolean;
    checkNombreExists: (nombre: string, excludeId?: number | null) => boolean;
    checkTelefonoExists: (telefono: string, excludeId?: number | null) => boolean;
}

const ITEMS_PER_PAGE = 10;
const API_BASE_URL = '/api/v1/clientes';

export const useClientes = (): UseClientesReturn => {
    // States
    const [allClientes, setAllClientes] = useState<Cliente[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleApiResponse = async <T>(response: Response): Promise<T> => {
        if (!response.ok) {
            let errorMessage = `Error ${response.status}`;
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    const htmlText = await response.text();
                    if (htmlText.includes('<!DOCTYPE')) {
                        errorMessage = 'Error del servidor - respuesta inesperada (HTML)';
                    } else {
                        errorMessage = htmlText.substring(0, 100) || errorMessage;
                    }
                }
            } catch {
                errorMessage = 'Error de conexión o respuesta inválida';
            }
            throw new Error(errorMessage);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Respuesta del servidor no es JSON válido');
        }
        
        return response.json();
    };

    const fetchClientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = await handleApiResponse<{ data: Cliente[] }>(response);
            setAllClientes(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCliente = async (clienteData: ClienteInput): Promise<boolean> => {
        try {
            setError(null);
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });

            const data = await handleApiResponse<ApiResponse<Cliente>>(response);
            if (data.success) {
                await fetchClientes(); // Refresh list
                return true;
            }
            throw new Error(data.message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear cliente');
            return false;
        }
    };

    const deleteCliente = async (id: number): Promise<boolean> => {
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });

            const data = await handleApiResponse<ApiResponse<null>>(response);
            if (data.success) {
                setAllClientes((prev) => prev.filter((cliente) => cliente.id !== id));
                return true;
            }
            throw new Error(data.message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar cliente');
            return false;
        }
    };

    const refreshClientes = async (): Promise<void> => {
        await fetchClientes();
    };

    const clearError = (): void => {
        setError(null);
    };

    const totalItems = allClientes.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const clientes = allClientes.slice(startIndex, endIndex);

    const setPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const searchClientes = (searchTerm: string): Cliente[] => {
        if (!searchTerm.trim()) return allClientes;
        
        return allClientes.filter(
            (cliente) =>
                cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cliente.telefono && cliente.telefono.includes(searchTerm)),
        );
    };

    const checkEmailExists = (email: string): boolean => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
        
        return allClientes.some(cliente => 
            cliente.email.toLowerCase() === email.toLowerCase()
        );
    };

    const checkNombreExists = (nombre: string): boolean => {
        if (!nombre || nombre.trim().length < 2) return false;
        
        return allClientes.some(cliente => 
            cliente.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
        );
    };

    const checkTelefonoExists = (telefono: string): boolean => {
        if (!telefono || telefono.length < 8) return false;
        
        return allClientes.some(cliente => 
            cliente.telefono === telefono
        );
    };

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    return {
        clientes,
        allClientes,
        
        loading,
        error,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE,
        createCliente,
        deleteCliente,
        refreshClientes,
        clearError,
        
        // Pagination & Search
        setPage,
        searchClientes,
        
        // Validation helpers
        checkEmailExists,
        checkNombreExists,
        checkTelefonoExists,
    };
};
