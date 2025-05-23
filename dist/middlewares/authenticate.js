import jwt from 'jsonwebtoken';
export async function authenticate(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader)
            throw new Error('Token missing');
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
    }
    catch (error) {
        return reply.status(401).send({ success: false, message: 'Unauthorized' });
    }
}
