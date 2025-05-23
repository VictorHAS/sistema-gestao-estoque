export class Response {
    static ok(reply, data) {
        return reply.code(200).send({ success: true, data });
    }
    static created(reply, data) {
        return reply.code(201).send({ success: true, data });
    }
    static noContent(reply) {
        return reply.code(204).send();
    }
    static badRequest(reply, message) {
        return reply.code(400).send({ success: false, message });
    }
    static unauthorized(reply, message) {
        return reply.code(401).send({ success: false, message });
    }
    static notFound(reply, message) {
        return reply.code(404).send({ success: false, message });
    }
    static internalError(reply, message) {
        return reply.code(500).send({ success: false, message });
    }
}
