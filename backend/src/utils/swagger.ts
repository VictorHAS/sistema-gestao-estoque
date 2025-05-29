import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

export const opcoesSwagger: FastifyDynamicSwaggerOptions = {
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  
  mode: 'dynamic',
};


export const opcoesSwaggerUi: FastifySwaggerUiOptions = {
  routePrefix: '/documentacao',
  uiConfig: {
    docExpansion: 'none',
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
};
