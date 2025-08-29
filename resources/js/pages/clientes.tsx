import React, { useState } from 'react';
import { useClientes, type Cliente, type ClienteInput } from '../hooks/useClientes';
import { useValidation } from '../hooks/useValidation';
import { Pagination } from '../components/Pagination';

const ClientesPage: React.FC = () => {
    // Hooks
    const { 
        clientes, 
        loading, 
        error, 
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        createCliente, 
        deleteCliente,
        setPage,
        searchClientes,
        clearError,
        checkEmailExists,
        checkNombreExists,
        checkTelefonoExists
    } = useClientes();

    const {
        errors: validationErrors,
        validateForm,
        validateField,
        clearErrors: clearValidationErrors,
        clearFieldError
    } = useValidation();
    
    // Form states
    const [formData, setFormData] = useState<ClienteInput>({
        nombre: '',
        email: '',
        telefono: ''
    });
    
    const [searchTerm, setSearchTerm] = useState('');

    // Utility states
    const [emailExists, setEmailExists] = useState(false);
    const [nombreExists, setNombreExists] = useState(false);
    const [telefonoExists, setTelefonoExists] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isCheckingNombre, setIsCheckingNombre] = useState(false);
    const [isCheckingTelefono, setIsCheckingTelefono] = useState(false);

    // Helper functions
    const updateFormData = (field: keyof ClienteInput, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearFieldError(field);
        
        if (field === 'email' && value) {
            checkDuplicateEmail(value);
        } else if (field === 'nombre' && value) {
            checkDuplicateNombre(value);
        } else if (field === 'telefono' && value) {
            checkDuplicateTelefono(value);
        }
    };

    const checkDuplicateEmail = (email: string) => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailExists(false);
            return;
        }
        
        setIsCheckingEmail(true);
        try {
            const exists = checkEmailExists(email);
            setEmailExists(exists);
            
            validateField('email', email, { emailExists: exists });
        } catch (error) {
            console.error('Error checking email:', error);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const checkDuplicateNombre = (nombre: string) => {
        if (!nombre || nombre.trim().length < 2) {
            setNombreExists(false);
            return;
        }
        
        setIsCheckingNombre(true);
        try {
            const exists = checkNombreExists(nombre);
            setNombreExists(exists);
            
            validateField('nombre', nombre, { nombreExists: exists });
        } catch (error) {
            console.error('Error checking nombre:', error);
        } finally {
            setIsCheckingNombre(false);
        }
    };

    const checkDuplicateTelefono = (telefono: string) => {
        if (!telefono || telefono.length < 8) {
            setTelefonoExists(false);
            return;
        }
        
        setIsCheckingTelefono(true);
        try {
            const exists = checkTelefonoExists(telefono);
            setTelefonoExists(exists);
            
            validateField('telefono', telefono, { telefonoExists: exists });
        } catch (error) {
            console.error('Error checking telefono:', error);
        } finally {
            setIsCheckingTelefono(false);
        }
    };

    // Form handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm(formData, { emailExists, nombreExists, telefonoExists })) {
            return;
        }

        const success = await createCliente(formData);
        if (success) {
            setFormData({ nombre: '', email: '', telefono: '' });
            clearValidationErrors();
            setEmailExists(false);
            setNombreExists(false);
            setTelefonoExists(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this client?')) {
            return;
        }
        
        await deleteCliente(id);
    };

    // Data filtering
    const displayedClientes = searchTerm ? searchClientes(searchTerm) : clientes;

    return (
        <div className="min-h-screen bg-black">
            <div className="mx-auto max-w-7xl p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Client Management</h1>
                    <p className="text-gray-400">Manage your client database efficiently</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    
                    <div className="xl:col-span-2">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6 shadow-2xl">
                            <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center">
                                <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Client
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            value={formData.nombre}
                                            onChange={(e) => updateFormData('nombre', e.target.value)}
                                            className={`w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg bg-gray-800 border transition-all duration-200 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                                                validationErrors.nombre || nombreExists
                                                    ? 'border-red-500 focus:border-red-500' 
                                                    : 'border-gray-700 focus:border-blue-500'
                                            }`}
                                        />
                                        {isCheckingNombre && (
                                            <div className="absolute right-2 lg:right-3 top-2 lg:top-3">
                                                <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-blue-400"></div>
                                            </div>
                                        )}
                                    </div>
                                    {(validationErrors.nombre || nombreExists) && (
                                        <p className="mt-1 flex items-center text-xs lg:text-sm text-red-400">
                                            <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {validationErrors.nombre || 'A client with this name already exists'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="example@email.com"
                                            value={formData.email}
                                            onChange={(e) => updateFormData('email', e.target.value)}
                                            className={`w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg bg-gray-800 border transition-all duration-200 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                                                validationErrors.email || emailExists
                                                    ? 'border-red-500 focus:border-red-500' 
                                                    : 'border-gray-700 focus:border-blue-500'
                                            }`}
                                        />
                                        {isCheckingEmail && (
                                            <div className="absolute right-2 lg:right-3 top-2 lg:top-3">
                                                <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-blue-400"></div>
                                            </div>
                                        )}
                                    </div>
                                    {(validationErrors.email || emailExists) && (
                                        <p className="mt-1 flex items-center text-xs lg:text-sm text-red-400">
                                            <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {validationErrors.email || 'This email is already registered'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Phone
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            placeholder="Phone number (optional)"
                                            value={formData.telefono}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                updateFormData('telefono', value);
                                            }}
                                            className={`w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg bg-gray-800 border transition-all duration-200 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                                                validationErrors.telefono || telefonoExists
                                                    ? 'border-red-500 focus:border-red-500' 
                                                    : 'border-gray-700 focus:border-blue-500'
                                            }`}
                                        />
                                        {isCheckingTelefono && (
                                            <div className="absolute right-2 lg:right-3 top-2 lg:top-3">
                                                <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-blue-400"></div>
                                            </div>
                                        )}
                                    </div>
                                    {(validationErrors.telefono || telefonoExists) && (
                                        <p className="mt-1 flex items-center text-xs lg:text-sm text-red-400">
                                            <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {validationErrors.telefono || 'This phone number is already registered'}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || emailExists || nombreExists || telefonoExists || Object.keys(validationErrors).length > 0}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-sm lg:text-base"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-white mr-2"></div>
                                            Adding...
                                        </div>
                                    ) : (
                                        'Add Client'
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-4 lg:mt-6 bg-red-900/50 border border-red-700 rounded-lg p-3 lg:p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-red-300 text-xs lg:text-sm">{error}</p>
                                        </div>
                                        <button
                                            onClick={clearError}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="xl:col-span-3">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                            
                            <div className="bg-gray-800 border-b border-gray-700 p-4 lg:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4">
                                    <div>
                                        <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center">
                                            <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Client List
                                        </h2>
                                        <p className="text-gray-400 text-xs lg:text-sm mt-1">
                                            {totalItems} client{totalItems !== 1 ? 's' : ''} registered
                                        </p>
                                    </div>
                                    
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search clients..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full sm:w-48 lg:w-64 px-3 py-2 pl-8 lg:pl-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                                        />
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 absolute left-2 lg:left-3 top-2.5 lg:top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 lg:p-6">
                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                                        <span className="ml-3 text-gray-400">Loading clients...</span>
                                    </div>
                                ) : displayedClientes.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-300 mb-1">
                                            {searchTerm ? 'No clients found' : 'No clients registered'}
                                        </h3>
                                        <p className="text-gray-500">
                                            {searchTerm ? 'Try different search terms' : 'Start by adding your first client'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 lg:space-y-3">
                                        {displayedClientes.map((cliente) => (
                                            <div key={cliente.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3 lg:p-4 hover:bg-gray-750 transition-colors duration-200">
                                                {/* Modo Visualización */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <h3 className="text-sm lg:text-base font-semibold text-white truncate mb-1">
                                                            {cliente.nombre}
                                                        </h3>
                                                        <div className="flex flex-col gap-0.5 text-xs lg:text-sm text-gray-400">
                                                            <span className="flex items-center truncate">
                                                                <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                                </svg>
                                                                <span className="truncate">{cliente.email}</span>
                                                            </span>
                                                            {cliente.telefono && (
                                                                <span className="flex items-center">
                                                                    <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                    </svg>
                                                                    {cliente.telefono}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => handleDelete(cliente.id)}
                                                            className="p-1.5 lg:p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                                                            title="Delete client"
                                                        >
                                                            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientesPage;
