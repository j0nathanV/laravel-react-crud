import React, { useEffect } from 'react';

const IndexPage: React.FC = () => {
  useEffect(() => {
    // Redirige automáticamente a la página de clientes
    window.location.href = '/clientes-ui';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
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
