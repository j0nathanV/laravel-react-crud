import React, { useEffect, useState } from 'react';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
}

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  // Listar clientes
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
  const res = await fetch('/api/clientes');
      if (!res.ok) throw new Error('Error al cargar clientes');
      const data = await res.json();
      setClientes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Crear cliente
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
  const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al crear cliente');
      }
      setNombre('');
      setEmail('');
      setTelefono('');
      fetchClientes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Eliminar cliente
  const handleDelete = async (id: number) => {
    setError(null);
    try {
  const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar cliente');
      fetchClientes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Crear</button>
      </form>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <ul className="space-y-2">
          {clientes.map(cliente => (
            <li key={cliente.id} className="flex justify-between items-center border p-2 rounded">
              <div>
                <span className="font-semibold">{cliente.nombre}</span> <br />
                <span className="text-sm text-gray-600">{cliente.email}</span>
                {cliente.telefono && <span className="ml-2 text-sm"> | {cliente.telefono}</span>}
              </div>
              <button
                onClick={() => handleDelete(cliente.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientesPage;
