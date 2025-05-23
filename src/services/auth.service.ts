import { prisma } from '../config/prisma';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

export class AuthService {
  async login(email: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );
  }
}
