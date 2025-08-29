import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cliente } from '@/hooks/useClientes';
import React, { useEffect, useState } from 'react';

interface ClienteFormProps {
    onSubmit: (data: Omit<Cliente, 'id'>) => Promise<boolean>;
    initialData?: Cliente;
    title?: string;
    submitLabel?: string;
    onCancel?: () => void;
}

interface FormErrors {
    nombre?: string;
    email?: string;
    telefono?: string;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({ onSubmit, initialData, title = 'Nuevo Cliente', submitLabel = 'Guardar', onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        email: initialData?.email || '',
        telefono: initialData?.telefono || '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre,
                email: initialData.email,
                telefono: initialData.telefono || '',
            });
        }
    }, [initialData]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'Name is required';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
            newErrors.nombre = 'Name can only contain letters and spaces';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }

        if (formData.telefono && formData.telefono.length < 8) {
            newErrors.telefono = 'Phone must be at least 8 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const success = await onSubmit(formData);
            if (success && !initialData) {
                // Reset form only if creating new client
                setFormData({ nombre: '', email: '', telefono: '' });
                setErrors({});
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Special handling for phone numbers
        if (field === 'telefono') {
            value = value.replace(/[^0-9+\-\s()]/g, '');
        }

        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input
                            id="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange('nombre')}
                            placeholder="Enter full name"
                            className={errors.nombre ? 'border-red-500' : ''}
                            disabled={isSubmitting}
                        />
                        {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            placeholder="example@email.com"
                            className={errors.email ? 'border-red-500' : ''}
                            disabled={isSubmitting}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            type="tel"
                            value={formData.telefono}
                            onChange={handleChange('telefono')}
                            placeholder="Phone number"
                            className={errors.telefono ? 'border-red-500' : ''}
                            disabled={isSubmitting}
                        />
                        {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? 'Guardando...' : submitLabel}
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
