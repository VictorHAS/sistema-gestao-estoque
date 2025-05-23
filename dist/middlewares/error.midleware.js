export function tratadorErros(error, request, reply) {
    console.error(error);
    // Erros de validação do Fastify
    if (error.validation) {
        return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: error.message,
        });
    }
    // Erros do Prisma
    if (error.code?.startsWith('P')) {
        return reply.status(400).send({
            statusCode: 400,
            error: 'Database Error',
            message: 'Ocorreu um erro no banco de dados',
        });
    }
    // Erros personalizados
    if (error.statusCode) {
        return reply.status(error.statusCode).send({
            statusCode: error.statusCode,
            error: error.name,
            message: error.message,
        });
    }
    // Erro padrão
    return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Ocorreu um erro interno no servidor',
    });
}
