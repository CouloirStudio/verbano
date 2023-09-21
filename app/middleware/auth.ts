import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

module.exports = (context: { req: { headers: { authorization: any; }; }; }) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {

        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                return jwt.verify(token, process.env.JWT_SECRET as string);
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]'");
    }
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  throw new Error('Authorization header must be provided');
};
