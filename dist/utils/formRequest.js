export function validate(schema) {
    return (request, reply, done) => {
        try {
            schema.parse(request.body);
            done();
        }
        catch (error) {
            reply.status(400).send({
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            });
        }
    };
}
