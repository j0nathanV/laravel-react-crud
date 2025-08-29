import { useState } from 'react';
import type { ValidationErrors, ClienteInput } from '../types';
import { APP_CONSTANTS } from '../types';

interface UseValidationReturn {
    errors: ValidationErrors;
    isValid: boolean;
    validateField: (field: keyof ClienteInput, value: string, extraData?: any) => boolean;
    validateForm: (data: ClienteInput, duplicateChecks?: DuplicateChecks) => boolean;
    clearErrors: () => void;
    clearFieldError: (field: keyof ClienteInput) => void;
}

interface DuplicateChecks {
    emailExists?: boolean;
    nombreExists?: boolean;
    telefonoExists?: boolean;
}

export const useValidation = (): UseValidationReturn => {
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateField = (
        field: keyof ClienteInput, 
        value: string, 
        extraData?: { emailExists?: boolean; nombreExists?: boolean; telefonoExists?: boolean }
    ): boolean => {
        const newErrors = { ...errors };
        
        switch (field) {
            case 'nombre':
                if (!value.trim()) {
                    newErrors.nombre = 'Name is required';
                } else if (value.trim().length < APP_CONSTANTS.VALIDATION_RULES.MIN_NAME_LENGTH) {
                    newErrors.nombre = `Name must be at least ${APP_CONSTANTS.VALIDATION_RULES.MIN_NAME_LENGTH} characters`;
                } else if (!APP_CONSTANTS.VALIDATION_RULES.NAME_REGEX.test(value)) {
                    newErrors.nombre = 'Name can only contain letters and spaces';
                } else if (!APP_CONSTANTS.VALIDATION_RULES.NAME_QUALITY_REGEX.test(value)) {
                    newErrors.nombre = 'Name cannot have more than 3 consecutive identical letters';
                } else if (extraData?.nombreExists) {
                    newErrors.nombre = 'A client with this name already exists';
                } else {
                    delete newErrors.nombre;
                }
                break;

            case 'email':
                if (!value.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!APP_CONSTANTS.VALIDATION_RULES.EMAIL_REGEX.test(value)) {
                    newErrors.email = 'Email format is invalid';
                } else if (extraData?.emailExists) {
                    newErrors.email = 'This email is already registered';
                } else {
                    delete newErrors.email;
                }
                break;

            case 'telefono':
                if (value && value.length < APP_CONSTANTS.VALIDATION_RULES.MIN_PHONE_LENGTH) {
                    newErrors.telefono = `Phone must be at least ${APP_CONSTANTS.VALIDATION_RULES.MIN_PHONE_LENGTH} digits`;
                } else if (value && !APP_CONSTANTS.VALIDATION_RULES.PHONE_REGEX.test(value)) {
                    newErrors.telefono = 'Phone can only contain numbers';
                } else if (value && !APP_CONSTANTS.VALIDATION_RULES.PHONE_QUALITY_REGEX.test(value)) {
                    newErrors.telefono = 'Phone cannot have more than 4 consecutive identical digits';
                } else if (value && extraData?.telefonoExists) {
                    newErrors.telefono = 'This phone number is already registered';
                } else {
                    delete newErrors.telefono;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return !newErrors[field];
    };

    const validateForm = (data: ClienteInput, duplicateChecks: DuplicateChecks = {}): boolean => {
        const formErrors: ValidationErrors = {};

        if (!data.nombre.trim()) {
            formErrors.nombre = 'Name is required';
        } else if (data.nombre.trim().length < APP_CONSTANTS.VALIDATION_RULES.MIN_NAME_LENGTH) {
            formErrors.nombre = `Name must be at least ${APP_CONSTANTS.VALIDATION_RULES.MIN_NAME_LENGTH} characters`;
        } else if (!APP_CONSTANTS.VALIDATION_RULES.NAME_REGEX.test(data.nombre)) {
            formErrors.nombre = 'Name can only contain letters and spaces';
        } else if (!APP_CONSTANTS.VALIDATION_RULES.NAME_QUALITY_REGEX.test(data.nombre)) {
            formErrors.nombre = 'Name cannot have more than 3 consecutive identical letters';
        } else if (duplicateChecks.nombreExists) {
            formErrors.nombre = 'A client with this name already exists';
        }

        if (!data.email.trim()) {
            formErrors.email = 'Email is required';
        } else if (!APP_CONSTANTS.VALIDATION_RULES.EMAIL_REGEX.test(data.email)) {
            formErrors.email = 'Email format is invalid';
        } else if (duplicateChecks.emailExists) {
            formErrors.email = 'This email is already registered';
        }

        if (data.telefono && data.telefono.length < APP_CONSTANTS.VALIDATION_RULES.MIN_PHONE_LENGTH) {
            formErrors.telefono = `Phone must be at least ${APP_CONSTANTS.VALIDATION_RULES.MIN_PHONE_LENGTH} digits`;
        } else if (data.telefono && !APP_CONSTANTS.VALIDATION_RULES.PHONE_REGEX.test(data.telefono)) {
            formErrors.telefono = 'Phone can only contain numbers';
        } else if (data.telefono && !APP_CONSTANTS.VALIDATION_RULES.PHONE_QUALITY_REGEX.test(data.telefono)) {
            formErrors.telefono = 'Phone cannot have more than 4 consecutive identical digits';
        } else if (data.telefono && duplicateChecks.telefonoExists) {
            formErrors.telefono = 'This phone number is already registered';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const clearErrors = (): void => {
        setErrors({});
    };

    const clearFieldError = (field: keyof ClienteInput): void => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
        validateField,
        validateForm,
        clearErrors,
        clearFieldError,
    };
};
