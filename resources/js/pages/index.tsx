import React, { useEffect } from 'react';

const IndexPage: React.FC = () => {
    useEffect(() => {
        window.location.href = '/clientes-ui';
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="mb-4 text-2xl font-bold">Redirecting...</h1>
                <p>Redirigiendo a la aplicación de clientes...</p>
                <div className="mt-4">
                    <a href="/clientes-ui" className="text-blue-600 underline">
                        Si no se redirige automáticamente, haz clic aquí
                    </a>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
