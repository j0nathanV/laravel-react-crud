export interface Cliente {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    created_at?: string;
    updated_at?: string;
}

export type ClienteInput = Omit<Cliente, 'id' | 'created_at' | 'updated_at'>;

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
}

export interface ValidationErrors {
    [key: string]: string;
}

export interface FormState {
    isSubmitting: boolean;
    errors: ValidationErrors;
}

export interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export const APP_CONSTANTS = {
    ITEMS_PER_PAGE: 15,
    API_BASE_URL: '/api/v1',
    VALIDATION_RULES: {
        MIN_NAME_LENGTH: 2,
        MIN_PHONE_LENGTH: 8,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        NAME_REGEX: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        NAME_QUALITY_REGEX: /^(?!.*(.)\1{3,})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        PHONE_REGEX: /^\d+$/,
        PHONE_QUALITY_REGEX: /^(?!.*(\d)\1{4,})(?!0+$)\d+$/,
    },
} as const;
