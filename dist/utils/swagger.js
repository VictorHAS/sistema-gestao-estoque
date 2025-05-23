export const opcoesSwagger = {
    swagger: {
        info: {
            title: 'API do Sistema de Gestão de Estoque',
            description: 'Documentação da API para o Sistema de Gestão de Estoque',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
    },
    mode: 'dynamic',
};
export const opcoesSwaggerUi = {
    routePrefix: '/documentacao',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: true,
    },
    staticCSP: true,
};
