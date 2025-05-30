// ============================================================================
// NOVA ESTRUTURA DA API - CENTRALIZADA
// ============================================================================

// Exportar o cliente API principal e funções utilitárias
export { apiClient, api, buildUrl, buildQueryString } from './client';

// Exportar todos os tipos da nova estrutura
export * from './types';

// Exportar configurações específicas
export { API_CONFIG, HTTP_STATUS } from './types';

// ============================================================================
// COMPATIBILIDADE - ALIASES PARA IMPORTS ANTIGOS
// ============================================================================

// Para compatibilidade com código existente que usa ApiClient
export { apiClient as ApiClient } from './client';
